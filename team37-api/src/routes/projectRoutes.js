import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectsByLearnerId,
  getProjectsByEvent,
  getProjectForEdit,
  getLearnersInProjects,
  getProjectWithMarksheets,
} from "../controllers/projectControllers.js";
import {
  assignProjectToJudge,
  automateProjectAllocation,
  getAllocatedProjects,
  getJudgeProjectAssignments,
  handleLateJudgeAllocation,
  promoteProject,
  removeProjectFromJudge,
  reallocateProjectFromLatePool,
  handleAbsentJudgeProjects,
  getLatePoolProjects,
  getRecommendationsByEvent,
  getShortlistByEvent,
  updateRecommendationStatus,
  shortlistProject,
  removeShortlist
} from "../controllers/projectAllocationControllers.js";

const projectRouter = express.Router();

projectRouter.post("/create/project", createProject);
projectRouter.get("/", getAllProjects);
projectRouter.get("/:id", getProjectById);
projectRouter.get("/get-for-edit/:id", getProjectForEdit);
projectRouter.put("/update/:id", updateProject);
projectRouter.delete("/:id", deleteProject);
projectRouter.post("/allocate/projects/:eventid", automateProjectAllocation);
projectRouter.get("/get-project-learners/:projectId", getLearnersInProjects);
projectRouter.get("/allocated/:judgeid", getAllocatedProjects);
projectRouter.post("/promote", promoteProject);
projectRouter.get("/learner/project/:learnerid", getProjectsByLearnerId);
projectRouter.get("/event/:eventid", getProjectsByEvent);
projectRouter.get("/judge/projects/:eventid", getJudgeProjectAssignments);
projectRouter.post("/judgeprojects/assign", assignProjectToJudge);
projectRouter.delete("/judgeprojects/:judgeid/:projectid",removeProjectFromJudge);
projectRouter.put("/allocate-late/:judgeId/:eventId", handleLateJudgeAllocation);
projectRouter.get("/marksheets/:id", getProjectWithMarksheets);
projectRouter.post("/reallocate-free/:judgeid/:eventid", reallocateProjectFromLatePool);
projectRouter.post("/handle-absent-judges/:eventid", handleAbsentJudgeProjects);
projectRouter.get("/get/late/pool/projects/:eventid",getLatePoolProjects);
projectRouter.get("/get/recommended/projects/:eventid", getRecommendationsByEvent);
projectRouter.get("/get/shortlist/:eventid", getShortlistByEvent);
projectRouter.get("/update/recommendation/status/:recommendationId", updateRecommendationStatus);
projectRouter.post("/shortlist/project", shortlistProject);
projectRouter.delete("/delete/project/shortlist", removeShortlist);
/* projectRouter.get("/events/:eventid", (req, res) => {
  const { eventid } = req.params;

  // Set headers required for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // Flush the headers to establish the connection

  // The listener function
  const listener = (data) => {
    // Only send updates for the relevant event
    if (data.eventId === eventid) {
      // SSE data must be formatted as "data: ...\n\n"
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  };

  // Attach the listener to our emitter
  projectEmitter.on('project-reallocated', listener);

  // Clean up when the client closes the connection
  req.on('close', () => {
    projectEmitter.removeListener('project-reallocated', listener);
    res.end();
  });
}); */

export default projectRouter;
