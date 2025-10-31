import express from "express";
import {
  getJudgeConflicts,
  resolveConflict,
  getAllConflicts,
  requestMeetup,
  getMeetups,
  getCategoryConflicts,
  getJudgeMarksheetConflicts,
  resolveMarksheetConflict,
} from "../controllers/conflictControllers.js";

const conflictRouter = express.Router();

conflictRouter.get("/all/:judgeId", getJudgeConflicts);
conflictRouter.put("/resolve/:conflictId", resolveConflict);
conflictRouter.get("/getAll", getAllConflicts);
conflictRouter.put("/request-meet/:conflictId", requestMeetup);
conflictRouter.get("/get-meetups/:judgeId", getMeetups);
conflictRouter.get("/category/:eventId/:judgeId", getCategoryConflicts);
conflictRouter.get("/marksheets/:judgeId", getJudgeMarksheetConflicts);
conflictRouter.put("/marksheets/resolve/:conflictId", resolveMarksheetConflict);

export default conflictRouter;
