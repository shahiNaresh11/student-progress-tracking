import { Activity } from '../models/index.model.js';
import { Op, Sequelize } from 'sequelize';

const ANALYSIS_WINDOW = 90;  // Analyze last 90 days
const MIN_ACTION_FREQUENCY = 2;  // Show recommendations for 2+ occurrences

class BehaviorAnalysis {
    constructor(studentId) {
        if (!studentId) {
            throw new Error('Student ID is required');
        }
        this.studentId = studentId;
    }

    async getNegativeBehaviorRecommendations() {
        try {
            const frequentNegatives = await this.getFrequentNegativeActions();
            
            if (!frequentNegatives?.length) {
                return [];
            }

            return frequentNegatives.map(action => this.mapActionToRecommendation(action));
            
        } catch (error) {
            console.error('BehaviorAnalysis.getNegativeBehaviorRecommendations failed:', error);
            throw new Error('Failed to generate behavior recommendations');
        }
    }

    async getFrequentNegativeActions() {
        try {
            return await Activity.findAll({
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
                order: [
                    [Sequelize.literal('count'), 'DESC'],
                    [Sequelize.literal('"totalPoints"'), 'ASC']
                ],
                raw: true
            });
            
        } catch (error) {
            console.error('BehaviorAnalysis.getFrequentNegativeActions failed:', error);
            throw error;
        }
    }

    mapActionToRecommendation(action) {
        return {
            type: 'BEHAVIOR_CORRECTION',
            issue: action.activity,
            occurrenceCount: Number(action.count),
            severity: this.getBehaviorSeverity(action.activity),
            improvementTips: this.getNegativeBehaviorTips(action.activity),
            suggestedReplacements: this.getPositiveReplacements(action.activity),
            specificRecommendation: this.getSpecificRecommendation(action.activity)
        };
    }

    getSpecificRecommendation(action) {
        const recommendations = {
            "Dress code violation": "You've violated the dress code multiple times. Please follow the college rules to avoid disciplinary action.",
            "Unauthorized device use": "Frequent device misuse observed. Keep phones away during class to stay focused and avoid penalties.",
            "Incomplete homework": "You often submit incomplete homework. Manage your time better and ask for help when needed.",
            "Late for class": "You are frequently late. Try setting alarms or preparing the night before.",
            "Fighting": "Violence is not tolerated. Seek help from a teacher or counselor immediately.",
            "Rude with teacher": "Disrespecting teachers is serious. Practice respectful communication and ask questions politely.",
            "Disruptive behavior": "You're being disruptive in class. Focus on listening actively and participating respectfully.",
            "default": `Frequent ${action.toLowerCase()} detected. Please address this behavior.`
        };
        return recommendations[action] || recommendations.default;
    }

    getNegativeBehaviorTips(action) {
        const tips = {
            "Late for class": ["Set multiple alarms", "Pack your bag the night before"],
            "Incomplete homework": ["Use a planner", "Work in 25-min focus blocks"],
            "Disruptive behavior": ["Practice active listening", "Raise hand before speaking"],
            "Unauthorized device use": ["Use app blockers during class", "Keep phone in bag"],
            "default": ["Consult with your teacher"]
        };
        return tips[action] || tips.default;
    }

    getPositiveReplacements(action) {
        const replacements = {
            "Late for class": ["Perfect attendance"],
            "Incomplete homework": ["Extra credit work"],
            "Disruptive behavior": ["Active participation"],
            "Unauthorized device use": ["Tech-free learning sessions"],
            "default": []
        };
        return replacements[action] || replacements.default;
    }

    getBehaviorSeverity(action) {
        const severityLevels = {
            "Late for class": 2,
            "Incomplete homework": 3,
            "Dress code violation": 2,
            "Disruptive behavior": 3,
            "Unauthorized device use": 2,
            "Fighting": 5,
            "Rude with teacher": 4,
            "Fail in internal exams": 4,
            "default": 2
        };
        return severityLevels[action] || severityLevels.default;
    }
}

export default BehaviorAnalysis;