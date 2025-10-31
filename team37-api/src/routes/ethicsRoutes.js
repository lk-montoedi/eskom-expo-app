import express from "express";
import {
  getJudgeProjectsWithEthicsViolations,
  getProjectsWithEthicsViolationsForConvener,
  updateEthicsByConvener,
  isUserConvener,
  getEthicsReviewStatusForProjects,
  getConvenerReview,
  submitEthicsByJudge,
} from "../controllers/ethicsControllers.js";
import e from "express";

const ethicsRouter = express.Router();
ethicsRouter.put("/:projectId/judge", submitEthicsByJudge);

// JUDGE route: Get flagged projects for judge
ethicsRouter.get("/flagged-projects/:userId", getJudgeProjectsWithEthicsViolations);
ethicsRouter.get(
  "/flagged-projects/:judgeId",
  getJudgeProjectsWithEthicsViolations
);

// CONVENER route: Get flagged projects by category
ethicsRouter.get(
  "/flagged-projects/convener/:userId",
  getProjectsWithEthicsViolationsForConvener
);

// CONVENER route: Update ethics data
ethicsRouter.put("/update-convener-fields/:projectId", updateEthicsByConvener);

// Check if user is convener
ethicsRouter.get("/is-convener/:userId", isUserConvener);

ethicsRouter.get("/ethics-review-status", getEthicsReviewStatusForProjects);

// CONVENER route: Get a specific ethics review for a project
ethicsRouter.get("/convener-review/:projectId", getConvenerReview);
//ethicsRouter.get("/ethics-marksheets/latest-for", getLatestEthicsMarksheet);

export default ethicsRouter;
