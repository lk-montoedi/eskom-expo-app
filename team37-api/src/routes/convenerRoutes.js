import express from "express";
import {
  appoint,
  automateConvenerAppointment,
  getConvenersByEvent,
  removeConvenerFromEvent,
  updateConvenorCategory,
  getAllConveners,
  retryRejectedAllocation,
  rejectConvenerInvitation,
  acceptConvenerInvitation,
  getConvenerAppointments,
  handleRejectionAndReallocate,
  recommendProjectForShortlist,
  getRecommendedProjects,
  removeRecommendedProject,
} from "../controllers/convenerControllers.js";

const convenerRouter = express.Router();



convenerRouter.get("/user/:userid/events", getConvenerAppointments);
convenerRouter.get("/event/:eventid/conveners", getAllConveners);
convenerRouter.post("/appoint/:eventid", automateConvenerAppointment);
convenerRouter.post("/retry-rejected/:eventid", retryRejectedAllocation);
convenerRouter.put("/:judgeId/reject/:eventId", rejectConvenerInvitation);
convenerRouter.put("/:judgeId/accept/:eventId", acceptConvenerInvitation);
convenerRouter.post("/updateConvener", updateConvenorCategory);
convenerRouter.get("/event/conveners/:eventid", getConvenersByEvent);
convenerRouter.delete("/:eventid/:userid", removeConvenerFromEvent);
convenerRouter.post("/:eventid", appoint);
convenerRouter.post("/reject/:userid/reallocate/:eventid", handleRejectionAndReallocate);
convenerRouter.post("/recommend/:eventid/:userid/:projectid", recommendProjectForShortlist);
convenerRouter.get("/recommendations/:eventid/:projectid", getRecommendedProjects);
convenerRouter.delete("/recommendations/:eventid/:userid/:projectid", removeRecommendedProject);
export default convenerRouter;
