// routes/recommendationRoutes.js
import express from 'express';
import { getRecommendationsForStudent } from '../services/recommendation.services.js';



const router = express.Router();

router.get("/:studentId", async (req, res) => {
    try {
        const studentId = parseInt(req.params.studentId);
        const recommendations = await getRecommendationsForStudent(studentId);
        res.json({ studentId, recommendations });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to get recommendations." });
    }
});
export default router;
