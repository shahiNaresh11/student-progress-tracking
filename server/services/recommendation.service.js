import BehaviorAnalysis from './behaviorAnalysis.service.js'
import PositiveActions from './positiveActions.service.js';

const TOP_STUDENT_THRESHOLD = 80;

class BehaviorAnalyzer {
    constructor(studentId) {
        this.studentId = studentId;
        this.behaviorAnalysis = new BehaviorAnalysis(studentId);
        this.positiveActions = new PositiveActions(studentId);
    }

    async getComprehensiveRecommendations() {
        try {
            const [negativeRecs, positiveRecs] = await Promise.all([
                this.behaviorAnalysis.getNegativeBehaviorRecommendations(),
                this.positiveActions.getPositiveActionRecommendations()
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

    prioritizeRecommendations(negatives, positives) {
        return [
            ...negatives.map(n => ({
                ...n,
                priorityScore: n.occurrenceCount * n.severity
            })),
            ...positives.map(p => ({
                ...p,
                priorityScore: p.averagePoints * 2
            }))
        ].sort((a, b) => b.priorityScore - a.priorityScore);
    }
}

export default BehaviorAnalyzer;