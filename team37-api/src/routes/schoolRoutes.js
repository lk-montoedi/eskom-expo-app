import express from "express";
import {
  getAllSchools,
  getSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
} from "../controllers/schoolControllers.js";

const schoolRouter = express.Router();

schoolRouter.get("/names", getAllSchools);
schoolRouter.get("/", getSchools);
schoolRouter.get("/:id", getSchoolById);
schoolRouter.post("/", createSchool);
schoolRouter.put("/:id", updateSchool);
schoolRouter.delete("/:id", deleteSchool);

export default schoolRouter;
