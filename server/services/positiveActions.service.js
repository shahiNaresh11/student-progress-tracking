import { Activity, User, Point } from '../models/index.model.js';
import { Op, Sequelize } from 'sequelize';

const TOP_STUDENT_THRESHOLD = 80;
const ANALYSIS_WINDOW = 90;
const MIN_ACTION_FREQUENCY = 3;

class PositiveActions {
    constructor(studentId) {
        this.studentId = studentId;
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
}

export default PositiveActions;