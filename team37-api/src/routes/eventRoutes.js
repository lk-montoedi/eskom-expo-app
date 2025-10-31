import express from "express";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  updateEvent,
  getEventById,
  updateEventStatus,
  joinEvent,
  hasJoinedEvent,
  getJoinedEvents,
  startEvent,
  getEventCounts,
  getJudgeAttendanceForEvent,
  getPromotionTargets
} from "../controllers/eventControllers.js";
import {
  attendEvent,
  getEventAttendees,
} from "../controllers/eventAttendanceControllers.js";

const eventRouter = express.Router();

eventRouter.post("/", createEvent);
eventRouter.get("/events/getAll", getAllEvents);
eventRouter.get("/getAll", getAllEvents);
eventRouter.get("/events", getAllEvents);
eventRouter.put("/:id", updateEvent);
eventRouter.delete("/:id", deleteEvent);
eventRouter.get("/get/event/details/:id", getEventById);
eventRouter.post("/attend", attendEvent);
eventRouter.get("/:id/attendees", getEventAttendees);
eventRouter.patch("/events/status/:id", updateEventStatus);
eventRouter.post("/join/event/:id", joinEvent);
eventRouter.get("/event/:userId", hasJoinedEvent);
eventRouter.get("/joined/:userId", getJoinedEvents);
eventRouter.post("/start/event/:id", startEvent);
eventRouter.get("/event/:eventId", getEventCounts);
eventRouter.get("/attendance/:eventid", getJudgeAttendanceForEvent);
eventRouter.get("/promote-targets/:currentEventId", getPromotionTargets);

export default eventRouter;
