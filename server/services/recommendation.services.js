import { Op, Sequelize as sequelize } from 'sequelize';
import { User, Activity, Point, Attendance } from '../models/index.model.js';
import { classifyStudent, getReferenceGroup } from '../utils/classifier.js';

// 1. Enhanced main function with better error handling
export async function getSmartRecommendations(studentId) {
    if (!studentId) return ["Invalid student ID"];

    try {
        const target = await getStudentVector(studentId);
        const referenceStudents = await getReferenceStudents(studentId, target.vector[4]); // Pass current points

        if (referenceStudents.length === 0) {
            return ["No reference students found for comparison."];
        }

        const avgVector = calculateAverageVector(referenceStudents);
        const recommendations = generateGapRecommendations(target, avgVector);
        const topStrategies = await getTopStrategies(referenceStudents);

        return [...recommendations, ...topStrategies];
    } catch (error) {
        console.error('Recommendation error:', error);
        return ["Unable to generate recommendations at this time."];
    }
}

// 2. Enhanced student vector with better null checks
async function getStudentVector(studentId) {
    try {
        const [attendance, activities, point] = await Promise.all([
            Attendance.findAll({ where: { student_id: studentId } }),
            Activity.findAll({
                where: { student_id: studentId },
                order: [['createdAt', 'DESC']]
            }),
            Point.findOne({ where: { student_id: studentId } })
        ]);

        const totalClasses = attendance?.length || 0;
        const presentCount = attendance?.filter(a => a.status === 'present').length || 0;
        const lateCount = attendance?.filter(a => a.status === 'late').length || 0;

        // Track frequent negative actions (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentNegatives = activities?.filter(a =>
            a.points < 0 &&
            new Date(a.createdAt) > thirtyDaysAgo
        ) || [];

        const activityCounts = {};
        recentNegatives.forEach(activity => {
            if (activity?.activity) {
                activityCounts[activity.activity] = (activityCounts[activity.activity] || 0) + 1;
            }
        });

        const frequentNegativeActions = Object.entries(activityCounts)
            .filter(([_, count]) => count >= 2)
            .map(([action]) => action);

        return {
            vector: [
                totalClasses > 0 ? presentCount / totalClasses : 0,
                totalClasses > 0 ? lateCount / totalClasses : 0,
                activities?.filter(a => a.points > 0).length || 0,
                activities?.filter(a => a.points < 0).length || 0,
                point?.total_points || 0
            ],
            frequentNegativeActions
        };
    } catch (error) {
        console.error('Error getting student vector:', error);
        return {
            vector: [0, 0, 0, 0, 0],
            frequentNegativeActions: []
        };
    }
}

// 3. COMPLETE implementation of getReferenceStudents
async function getReferenceStudents(targetStudentId, currentPoints = 0) {
    try {
        const targetClass = classifyStudent(currentPoints);
        const referenceClasses = getReferenceGroup(targetClass);

        // Get minimum points for reference group
        const minPoints = Math.max(
            referenceClasses.includes('OUTSTANDING') ? 90 :
                referenceClasses.includes('EXCELLENT') ? 80 : 60,
            currentPoints // Don't compare with students doing worse
        );

        const users = await User.findAll({
            include: [{
                model: Point,
                as: 'points', // ✅ FIXED: must match your model association alias
                required: true,
                where: { total_points: { [Op.gte]: minPoints } }
            }],
            where: { id: { [Op.ne]: targetStudentId } },
            attributes: ['id'],
            limit: 50
        });


        if (!users.length) return [];

        // Get vectors for all reference students
        const studentVectors = await Promise.all(
            users.map(async user => {
                const vec = await getStudentVector(user.id);
                return { ...vec, id: user.id };
            })
        );

        return studentVectors.filter(s => s.vector[4] >= currentPoints);

    } catch (error) {
        console.error('Error finding reference students:', error);
        return [];
    }
}

// 4. Improved recommendation generator with more specific advice
function generateGapRecommendations(target, refVec) {
    const { vector, frequentNegativeActions } = target || {};
    const [targetAtt = 0, targetLate = 0, targetPos = 0, targetNeg = 0, targetPts = 0] = vector || [];
    const [refAtt = 0, refLate = 0, refPos = 0, refNeg = 0, refPts = 0] = refVec || [];

    const recommendations = [];

    // Specific behavior-based recommendations
    frequentNegativeActions?.forEach(action => {
        const lowerAction = action.toLowerCase();

        if (lowerAction.includes('dress code')) {
            recommendations.push("Repeated dress code violations detected. Please review the school's dress policy and prepare your uniform the night before.");
        } else if (lowerAction.includes('device') || lowerAction.includes('phone')) {
            recommendations.push("Frequent unauthorized device usage noted. Keep devices in your bag during class hours to avoid penalties.");
        } else if (lowerAction.includes('late') || lowerAction.includes('tardy')) {
            recommendations.push("Multiple late arrivals recorded. Consider setting earlier alarms or preparing your materials the night before.");
        } else if (lowerAction.includes('homework') || lowerAction.includes('assignment')) {
            recommendations.push("Several incomplete homework submissions. Try using a planner to track assignments and deadlines.");
        } else if (lowerAction.includes('disrupt') || lowerAction.includes('behavior')) {
            recommendations.push("Disruptive behavior observed. Please be mindful of how your actions affect classmates.");
        } else {
            // ✅ Generic suggestion for custom repeated actions
            recommendations.push(`Action detected: "${action}". Consider improving your behavior related to this issue.`);
        }
    });


    // Performance gap recommendations (only show most critical ones)
    if (targetAtt < refAtt - 0.15) {
        recommendations.push("Your attendance rate is significantly lower than peers (missing " +
            Math.round((refAtt - targetAtt) * 100) + "% more classes).");
    }

    if (targetLate > refLate + 0.15 && !frequentNegativeActions?.some(a => a.toLowerCase().includes('late'))) {
        recommendations.push("You're arriving late much more often than peers. Aim to arrive 10 minutes early.");
    }

    if (targetNeg > refNeg + 3) {
        recommendations.push("You're receiving significantly more negative marks than peers (" +
            (targetNeg - refNeg) + " more incidents).");
    }

    if (targetPts < refPts - 15) {
        recommendations.push("Your point total is substantially below peer average (by " +
            Math.round(refPts - targetPts) + " points).");
    }

    return recommendations.length > 0 ? recommendations : ["You're performing similarly to your peers!"];
}

// 5. calculateAverageVector with better validation
function calculateAverageVector(students) {
    if (!students?.length || !students[0]?.vector) return [0, 0, 0, 0, 0];

    const vectorSize = students[0].vector.length;
    const sumVector = new Array(vectorSize).fill(0);
    let count = 0;

    students.forEach(student => {
        if (student?.vector?.length === vectorSize) {
            student.vector.forEach((value, index) => {
                sumVector[index] += value || 0;
            });
            count++;
        }
    });

    return count > 0 ? sumVector.map(sum => sum / count) : [0, 0, 0, 0, 0];
}

// 6. getTopStrategies with improved query
async function getTopStrategies(referenceStudents) {
    if (!referenceStudents?.length) return [];

    const studentIds = referenceStudents.map(s => s.id).filter(Boolean);
    if (!studentIds.length) return [];

    try {
        const strategies = await Activity.findAll({
            where: {
                student_id: { [Op.in]: studentIds },
                points: { [Op.gt]: 0 },
                createdAt: { [Op.gte]: sequelize.literal('DATE_SUB(NOW(), INTERVAL 3 MONTH)') }
            },
            attributes: [
                'activity',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['activity'],
            having: sequelize.literal('count >= 3'), // Only show consistently used strategies
            order: [[sequelize.literal('count'), 'DESC']],
            limit: 3,
            raw: true
        });

        return strategies.map(strategy =>
            `Top peers succeed by: ${strategy.activity} (used ${strategy.count} times)`
        );
    } catch (error) {
        console.error('Error finding top strategies:', error);
        return [];
    }
}