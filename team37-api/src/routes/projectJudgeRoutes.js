import express from "express";

import {
  getProjectsByJudgeCategory,
  getAllProjectsForJudges,
  getProjectsWithDetailsForJudging,
  getProjectDetailsFromJudges,
} from "../controllers/projectJudgeControllers.js";

// Making rouets for the judges'projects
// This router will handle all project-related routes for judges.

const projectJudgeRouter = express.Router();

// It will include routes to get projects by judge category, all projects for judges, and projects with details for judging.
projectJudgeRouter.get("/all-projects", getAllProjectsForJudges);
projectJudgeRouter.get(
  "/projects-with-details",
  getProjectsWithDetailsForJudging
);
projectJudgeRouter.get("/get/results/:projectId", getProjectDetailsFromJudges);
export default projectJudgeRouter;
