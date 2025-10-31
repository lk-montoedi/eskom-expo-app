import { sql } from "../config/db.js";

// Create a new rating and update the average rating for the judge
export const createRating = async (req, res) => {
    const { forJudgeId, fromJudgeId, rating, comments } = req.body;

    if (!forJudgeId || !fromJudgeId || !rating) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        // Insert the new rating
        const [newRating] = await sql`
            INSERT INTO judgeratings (forJudgeId, fromJudgeId, rating, comments)
            VALUES (${forJudgeId}, ${fromJudgeId}, ${rating}, ${comments})
            RETURNING *
        `;

        // Calculate the new average rating
        const ratings = await sql`
            SELECT rating FROM judgeratings WHERE forJudgeId = ${forJudgeId}
        `;

        const totalRating = ratings.reduce((acc, r) => acc + r.rating, 0);
        const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;

        // Update the judge's average rating
        await sql`
            UPDATE judges
            SET rating = ${averageRating.toFixed(2)}
            WHERE userId = ${forJudgeId}
        `;

        res.status(201).json(newRating);
    } catch (error) {
        console.error("Error creating rating:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get a specific rating
export const getRating = async (req, res) => {
    const { forJudgeId, fromJudgeId } = req.params;

    try {
        const [rating] = await sql`
            SELECT * FROM judgeratings
            WHERE forJudgeId = ${forJudgeId} AND fromJudgeId = ${fromJudgeId}
        `;
        if (rating) {
            res.status(200).json(rating);
        } else {
            res.status(404).json({ message: "Rating not found" });
        }
    } catch (error) {
        console.error("Error getting rating:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all ratings for a judge
export const getRatingsForJudge = async (req, res) => {
    const { forJudgeId } = req.params;

    try {
        const ratings = await sql`
            SELECT * FROM judgeratings
            WHERE forJudgeId = ${forJudgeId}
        `;
        res.status(200).json(ratings);
    } catch (error) {
        console.error("Error getting ratings for judge:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};