import express from "express";
import {
  getNotificationsForUser,
} from "../controllers/notificationControllers.js";

const router = express.Router();

// A single route to get all notifications for a user by their ID and role
router.get("/:userid", getNotificationsForUser);

export default router;