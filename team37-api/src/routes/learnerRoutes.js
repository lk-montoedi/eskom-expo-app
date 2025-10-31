import express from "express";
import { getLearnerInfo } from "../controllers/learnerControllers.js";
import {
  getLearners,
  getLearnerById,
  createLearner,
  updateLearner,
  deleteLearner,
} from "../controllers/learnerControllers.js";
import {
  getLearnersFromSchool,
  attendEvent,
} from "../controllers/teacherControllers.js";

const learnerRouter = express.Router();

// Get all learners
learnerRouter.get("/get/user/:userId", getLearnerInfo);
learnerRouter.get("/", getLearners);
learnerRouter.get("/:id", getLearnerById);
learnerRouter.post("/", createLearner);
learnerRouter.put("/:id", updateLearner);
learnerRouter.delete("/:id", deleteLearner);
learnerRouter.get("/getLearnersFromSchool/:id", getLearnersFromSchool);
learnerRouter.post("/join-event/:teacherId", attendEvent);

export default learnerRouter;
