// import BehaviorAnalyzer from "../services/recommendation.services.js";

import BehaviorAnalyzer from "../services/recommendation.services.js";

// Route controller to get combined recommendations
export const getCombinedRecommendations = async (req, res) => {
    try {
        const studentId = (req.params.studentId || "").trim();
        console.log("Student ID from request params:", JSON.stringify(studentId));

        if (!studentId) {
            return res.status(400).json({ success: false, message: "Student ID is required" });
        }

        const analyzer = new BehaviorAnalyzer(studentId);
        const result = await analyzer.getComprehensiveRecommendations();

        res.status(200).json({
            success: true,
            recommendations: result
        });
    } catch (error) {
        console.error("Recommendation generation failed:", error);
        res.status(500).json({
            success: false,
            message: "Error generating recommendations",
            error: error.message
        });
    }
};
