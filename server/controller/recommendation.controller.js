// import { getCollaborativeRecommendations } from "../services/.js";

import { getSmartRecommendations } from "../services/recommendation.services.js";

export const getRecommendations = async (req, res) => {
    try {
        const { studentId } = req.params;

        if (!studentId || isNaN(studentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID"
            });
        }

        const recommendations = await getSmartRecommendations(studentId);

        res.json({
            success: true,
            recommendations: recommendations.length > 0
                ? recommendations
                : ["No recommendations found for similar students"]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error generating recommendations",
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};