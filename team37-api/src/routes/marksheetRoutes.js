import express from "express";

import {
  createMarksheet,
  createEthicsMarksheet,
  getAllMarksheets,
  assignMarksheetToProject,
  getMarksheetById,
  seedRegularMarksheets,
  createAndAssignMarksheet,
  getProjectsWithDetailsForJudging,
  updateMarksheet,
  updateEthicsMarksheet,
  getAllProjectsForJudge,
  changeMarksheetType,
  getMarksheetByJudgeAndProject,
  getEthicsMarksheetById,
  getLatestEthicsMarksheet,
  getCoJudgesTotalScores,
  overrideTotalScoreByConvener,
} from "../controllers/marksheetControllers.js";

// Creating an instance of an Express router
const marksheetRouter = express.Router();


marksheetRouter.post("/marksheets", createMarksheet); // POST route to create a new regular marksheet
marksheetRouter.post("/ethics-marksheets", createEthicsMarksheet); // POST route to create a new ethics marksheet
marksheetRouter.get("/marksheets", getAllMarksheets); // GET route to retrieve all marksheets (id and type)
marksheetRouter.put("/type/:projectId", changeMarksheetType);
marksheetRouter.put(
  "/projects/:projectId/assign-marksheet",
  assignMarksheetToProject
); // PUT route to assign a marksheet to a project
marksheetRouter.get("/marksheets/:id", getMarksheetById); // GET route to retrieve a specific marksheet by its ID (id in URL)
marksheetRouter.get("/ethics-marksheets/:ethicsMarksheetId", getEthicsMarksheetById);
marksheetRouter.post("/seed-marksheets", seedRegularMarksheets); // POST route to seed the database with empty marksheets
marksheetRouter.post("/marksheets/create-and-assign", createAndAssignMarksheet); // POST route to create and assign both ethics and regular marksheets
marksheetRouter.get("/projects-with-details", getProjectsWithDetailsForJudging); // GET route to retrieve projects with learner and marksheet details
marksheetRouter.put("/marksheets/:marksheetId", updateMarksheet); // PUT route to update an existing regular marksheet by its ID (id in URL)

marksheetRouter.put("/ethics-marksheets/:ethicsMarksheetId", updateEthicsMarksheet);
marksheetRouter.get("/ethics-marksheets/latest", getLatestEthicsMarksheet);

marksheetRouter.get("/marksheets/judge/:judgeid", getAllProjectsForJudge); // GET route to retrieve all projects for a specific judge by their ID (judgeid in URL)
marksheetRouter.get(
  "/marksheets/judge/:judgeId/project/:projectId",
  getMarksheetByJudgeAndProject
);
marksheetRouter.get(
  "/marksheets/project/:projectId/co-judges-scores",
  getCoJudgesTotalScores
);
marksheetRouter.put(
  "/marksheets/project/:projectId/convener-override",
  overrideTotalScoreByConvener
);

// Exporting the router so it can be used by the main application
export default marksheetRouter;
