import express from "express";
import { createRating, getRating, getRatingsForJudge } from "../controllers/ratingsController.js";

const router = express.Router();

router.post("/", createRating);
router.get("/:forJudgeId/:fromJudgeId", getRating);
router.get("/:forJudgeId", getRatingsForJudge);

export default router;