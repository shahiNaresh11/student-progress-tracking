import { User, Attendance, Point, Activity } from "../models/index.model.js";



// Define these at the top level so they're accessible everywhere
const PREDEFINED_FEEDBACK = {
    "Late for class": "Try to be on time.",
    "Incomplete homework": "Complete your homework on time.",
    "Dress code violation": "Follow the school dress code.",
    "Disruptive behavior": "Maintain discipline in class.",
    "Unauthorized device use": "Avoid using unauthorized devices during class.",
    "Fighting": "Resolve conflicts peacefully and avoid physical altercations.",
    "Rude with teacher": "Be respectful towards teachers.",
    "fail in internal exams": "Study harder to pass internal exams.",
    "Helping classmates": "Be more supportive toward your classmates.",
    "Active participation": "Participate more actively in class discussions.",
    "Extra credit work": "Take initiative to complete extra credit work.",
    "Perfect attendance (week)": "Try to maintain a perfect attendance streak.",
    "Outstanding sports achievement": "Engage more in extracurricular or sports activities.",
    "Class Leader for Good Conduct": "Demonstrate leadership and good behavior in class.",
    "Top perfomer in internal exam": "Aim for top scores in internal assessments.",
};

const POSITIVE_ACTIONS = [
    "Helping classmates",
    "Active participation",
    "Extra credit work",
    "Perfect attendance (week)",
    "Outstanding sports achievement",
    "Class Leader for Good Conduct",
    "Top perfomer in internal exam"
];

const NEGATIVE_ACTIONS = [
    "Late for class",
    "Incomplete homework",
    "Dress code violation",
    "Disruptive behavior",
    "Unauthorized device use",
    "Fighting",
    "Rude with teacher",
    "fail in internal exams"
];

// Classifier (fallback)
function classifyActivity(activityText, pts) {
    const lower = activityText.toLowerCase();

    const negativeKeywords = [
        "fight", "disrespect", "cheat", "argue", "disrupt", "late", "absent", "missed", "ignore",
        "shout", "noise", "phone", "skip", "bully", "complain", "refuse", "damage", "steal",
        "interrupt", "detention", "warned", "punish", "fail",
    ];

    const positiveKeywords = [
        "ask", "submit", "help", "participate", "early", "present", "attend", "complete",
        "improve", "excellent", "good", "nice", "thanks", "answer", "respect", "cooperate",
        "lead", "teamwork", "support", "engage", "volunteer", "pass", "win",
    ];

    if (negativeKeywords.some(word => lower.includes(word)) || pts < 0) return "negative";
    if (positiveKeywords.some(word => lower.includes(word)) || pts > 0) return "positive";
    return "neutral";
}

async function getStudentVector(studentId) {
    const attendance = await Attendance.findAll({
        where: { student_id: studentId },
        order: [['date', 'DESC']]
    });
    const point = await Point.findOne({ where: { student_id: studentId } });
    const activities = await Activity.findAll({ where: { student_id: studentId } });

    // 1. Attendance Analysis (last 30 days)
    const recentAttendance = attendance.filter(record => {
        const recordDate = new Date(record.date);
        const daysDiff = (new Date() - recordDate) / (1000 * 60 * 60 * 24);
        return daysDiff <= 30;
    });

    const lateCount = recentAttendance.filter(a => a.status === "late").length;
    const absentCount = recentAttendance.filter(a => a.status === "absent").length;

    // 2. Activity Analysis
    const activityCounts = {};
    activities.forEach(act => {
        activityCounts[act.activity] = (activityCounts[act.activity] || 0) + 1;
    });

    return {
        studentId,
        lateCount,
        absentCount,
        activityCounts,
        totalPoints: point ? point.total_points : 0,
        activities
    };
}

export async function getRecommendationsForStudent(studentId) {
    const { lateCount, absentCount, activityCounts, totalPoints, activities } = await getStudentVector(studentId);
    const recommendations = [];

    // 1. Attendance-based repeated issues
    if (lateCount >= 3) {
        recommendations.push(` You've been late ${lateCount} times recently. ${PREDEFINED_FEEDBACK["Late for class"]}`);
    }
    if (absentCount >= 3) {
        recommendations.push(` You've been absent ${absentCount} times recently. Try to attend classes regularly.`);
    }

    // 2. Repeated negative actions (3+ times)
    for (const [action, count] of Object.entries(activityCounts)) {
        if (NEGATIVE_ACTIONS.includes(action) && count >= 3) {
            recommendations.push(` Repeated issue (${count}x): ${PREDEFINED_FEEDBACK[action]}`);
        }
    }

    // 3. Missing positive actions (only if no serious issues)
    if (recommendations.length === 0) {
        const activityList = activities.map(a => a.activity);
        for (const action of POSITIVE_ACTIONS) {
            if (!activityList.includes(action)) {
                recommendations.push(` Suggestion: ${PREDEFINED_FEEDBACK[action]}`);
            }
        }
    }

    // 4. Fallback if no specific issues
    if (recommendations.length === 0) {
        recommendations.push("Keep up the good work!");
    }

    return recommendations;
}