import express from "express";
import { saveLocation, getJudgeLocation, getAllLatestLocations } from "../controllers/locationController.js";

const locationRouter = express.Router();

// REST fallback (if WebSocket fails)
locationRouter.post("/", saveLocation);

// Fetch latest for one judge
locationRouter.get("/:judgeid", getJudgeLocation);

// Fetch latest for all judges
locationRouter.get("/", getAllLatestLocations);

export default locationRouter;
