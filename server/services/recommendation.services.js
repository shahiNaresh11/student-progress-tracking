import { Activity, User, Point } from '../models/index.model.js';
import { Op, Sequelize } from 'sequelize';

const TOP_STUDENT_THRESHOLD = 80;
const ANALYSIS_WINDOW = 90;
const MIN_ACTION_FREQUENCY = 3;

class BehaviorAnalyzer {
    constructor(studentId) {
        this.studentId = studentId;
    }

    async getComprehensiveRecommendations() {
        try {
            const [negativeRecs, positiveRecs] = await Promise.all([
                this.getNegativeBehaviorRecommendations(),
                this.getPositiveActionRecommendations()
            ]);

            return {
                success: true,
                recommendations: {
                    behaviorImprovements: negativeRecs,
                    positiveActionOpportunities: positiveRecs,
                    combinedPriorityList: this.prioritizeRecommendations(negativeRecs, positiveRecs)
                }
            };
        } catch (error) {
            console.error('Error in getComprehensiveRecommendations:', error);
            throw error;
        }
    }

    async getNegativeBehaviorRecommendations() {
        const frequentNegatives = await this.getFrequentNegativeActions();

        return frequentNegatives.map(action => ({
            type: 'BEHAVIOR_CORRECTION',
            issue: action.activity,
            occurrenceCount: Number(action.count),
            severity: this.getBehaviorSeverity(action.activity),
            improvementTips: this.getNegativeBehaviorTips(action.activity),
            suggestedReplacements: this.getPositiveReplacements(action.activity),
            specificRecommendation: action.count > 2 ? this.getSpecificRecommendation(action.activity) : null
        }));
    }

    async getFrequentNegativeActions() {
        return Activity.findAll({
            where: {
                student_id: this.studentId,
                points: { [Op.lt]: 0 },
                createdAt: {
                    [Op.gte]: Sequelize.literal(`NOW() - INTERVAL '${ANALYSIS_WINDOW} days'`)
                }
            },
            attributes: [
                'activity',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
                [Sequelize.fn('SUM', Sequelize.col('points')), 'totalPoints']
            ],
            group: ['activity'],
            having: Sequelize.literal(`COUNT(id) >= ${MIN_ACTION_FREQUENCY}`),
            order: [[Sequelize.literal('count DESC')]],
            raw: true
        });
    }

    getSpecificRecommendation(action) {
        const recs = {
            "Dress code violation": "You've violated the dress code multiple times. Please follow the college rules to avoid disciplinary action.",
            "Unauthorized device use": "Frequent device misuse observed. Keep phones away during class to stay focused and avoid penalties.",
            "Incomplete homework": "You often submit incomplete homework. Manage your time better and ask for help when needed.",
            "Late for class": "You are frequently late. Try setting alarms or preparing the night before.",
            "Fighting": "Violence is not tolerated. Seek help from a teacher or counselor immediately.",
            "Rude with teacher": "Disrespecting teachers is serious. Practice respectful communication and ask questions politely.",
            "Disruptive behavior": "You're being disruptive in class. Focus on listening actively and participating respectfully."
        };
        return recs[action] || null;
    }

    async getPositiveActionRecommendations() {
        const [topActions, myActions] = await Promise.all([
            this.getTopStudentActions(),
            this.getStudentPositiveActions()
        ]);

        const missingActions = topActions.filter(
            top => !myActions.some(my => my.activity === top.activity)
        );

        return missingActions.map(action => ({
            type: 'POSITIVE_ACTION',
            action: action.activity,
            averagePoints: parseFloat(action.avgPoints),
            adoptionRate: `${Math.round((action.studentCount / action.totalStudents) * 100)}% of top students`,
            implementationTips: [
                this.getCustomPositiveTip(action.activity)
            ]
        }));
    }

    getCustomPositiveTip(action) {
        const messages = {
            "Active participation": "Get involved in class through active participation to stand out academically.",
            "Extra credit work": "Work on extra credit tasks to gain more points and stand out like top students.",
            "Helping classmates": "Support your classmates to improve your learning and earn valuable points.",
            "Perfect attendance": "Maintain perfect attendance to build a strong reputation and gain points.",
            "Outstanding achievement": "Achieve excellence in academics to gain recognition and top scores.",
            "Community service": "Participate in community service to contribute and boost your profile.",
            "Sports achievement": "Engage in sports activities to enhance your skills and earn points.",
            "Outstanding sports achievement": "Excel in sports to gain recognition and follow in the footsteps of top performers."
        };
        return messages[action] || `Try engaging in "${action}" to earn more points and follow what top students are doing.`;
    }

    async getTopStudentActions() {
        const topStudents = await User.findAll({
            include: [{
                model: Point,
                as: 'points',
                where: { total_points: { [Op.gte]: TOP_STUDENT_THRESHOLD } }
            }],
            attributes: ['id']
        });

        if (!topStudents.length) return [];

        return Activity.findAll({
            where: {
                student_id: { [Op.in]: topStudents.map(s => s.id) },
                points: { [Op.gt]: 0 },
                createdAt: {
                    [Op.gte]: Sequelize.literal(`NOW() - INTERVAL '${ANALYSIS_WINDOW} days'`)
                }
            },
            attributes: [
                'activity',
                [Sequelize.fn('AVG', Sequelize.col('points')), 'avgPoints'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'actionCount'],
                [Sequelize.fn('COUNT', Sequelize.literal('DISTINCT(student_id)')), 'studentCount'],
                [Sequelize.literal(`${topStudents.length}`), 'totalStudents']
            ],
            group: ['activity'],
            having: Sequelize.literal(`COUNT(id) >= ${MIN_ACTION_FREQUENCY}`),
            order: [[Sequelize.literal('AVG("points") * COUNT("id") DESC')]],
            limit: 10,
            raw: true
        });
    }

    async getStudentPositiveActions() {
        return Activity.findAll({
            where: {
                student_id: this.studentId,
                points: { [Op.gt]: 0 }
            },
            attributes: ['activity'],
            raw: true
        });
    }

    prioritizeRecommendations(negatives, positives) {
        return [
            ...negatives.map(n => ({
                ...n,
                priorityScore: n.occurrenceCount * this.getBehaviorSeverity(n.issue)
            })),
            ...positives.map(p => ({
                ...p,
                priorityScore: p.averagePoints * 2
            }))
        ].sort((a, b) => b.priorityScore - a.priorityScore);
    }

    getNegativeBehaviorTips(action) {
        const tips = {
            "Late for class": ["Set multiple alarms", "Pack your bag the night before"],
            "Incomplete homework": ["Use a planner", "Work in 25-min focus blocks"]
        };
        return tips[action] || ["Consult with your teacher"];
    }

    getPositiveReplacements(action) {
        const map = {
            "Late for class": "Perfect attendance",
            "Incomplete homework": "Extra credit work",
            "Disruptive behavior": "Active participation"
        };
        return map[action] ? [map[action]] : [];
    }

    getBehaviorSeverity(action) {
        const severity = {
            "Late for class": 2,
            "Incomplete homework": 3,
            "Dress code violation": 1,
            "Disruptive behavior": 3,
            "Unauthorized device use": 2,
            "Fighting": 5,
            "Rude with teacher": 4,
            "Fail in internal exams": 4
        };
        return severity[action] || 1;
    }
}

export default BehaviorAnalyzer;
