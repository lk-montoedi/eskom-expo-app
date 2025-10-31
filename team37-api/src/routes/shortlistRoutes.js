import express from "express";
import {
  getAllShortlists,
  getShortlistById,
  createShortlist,
  updateShortlist,
  deleteShortlist,
} from "../controllers/shortlistControllers.js";

const shortlistRouter = express.Router();

// Get all shortlists (optionally filtered by eventid)
shortlistRouter.get("/shortlists", getAllShortlists);
shortlistRouter.get("/shortlists/event/:eventid", getAllShortlists);
// Get a single shortlist by ID
shortlistRouter.get("/shortlists/:id", getShortlistById);
// Create a shortlist
shortlistRouter.post("/shortlists", createShortlist);
// Update a shortlist by ID
shortlistRouter.put("/shortlists/:id", updateShortlist);
// Delete a shortlist by ID
shortlistRouter.delete("/shortlists/:id", deleteShortlist);

export default shortlistRouter;
