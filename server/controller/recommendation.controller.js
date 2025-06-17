// // controllers/recommendationController.js
// // import { getRecommendationsForStudent } from '../services/recommendationService.js';

// import { getRecommendationsForStudent } from "../services/recommendation.services.js";

// export async function getRecommendations(req, res) {
//     const studentId = req.params.studentId;

//     try {
//         const recommendations = await getRecommendationsForStudent(Number(studentId));
//         res.json({ studentId, recommendations });
//     } catch (error) {
//         console.error("Recommendation error:", error);
//         res.status(500).json({ error: "Failed to generate recommendations." });
//     }
// }
