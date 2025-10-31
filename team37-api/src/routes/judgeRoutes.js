import express from "express";
import {
  getJudgesByEvent,
  updatePushToken,
  getAllJudges,
  getCoJudge,
  getAllCoJudges,
} from "../controllers/judgeControllers.js";

const judgeRouter = express.Router();

// Route to automate convener appointment for an event
judgeRouter.get("/co-judge/all/:judgeid", getAllCoJudges);
judgeRouter.get("/event/judges/:eventid", getJudgesByEvent);
judgeRouter.get("/getAllJudges", getAllJudges);
judgeRouter.post("/update-token", updatePushToken);
judgeRouter.get("/co-judge/:judgeid/:projectid", getCoJudge);

export default judgeRouter;
