import express from "express";
import {
  checkInJudge,
  getJudgeAttendance,
  getAllAttendance,
  checkIfLate,
} from "../controllers/judgeAttendanceController.js";

const judgeAttendanceRouter = express.Router();

judgeAttendanceRouter.post("/check-in", checkInJudge);
judgeAttendanceRouter.get("/event/:eventid", getAllAttendance);
judgeAttendanceRouter.get("/:judgeid/:eventid", getJudgeAttendance);
judgeAttendanceRouter.get("/is-late/:judgeid/:eventid", checkIfLate);


export default judgeAttendanceRouter;
