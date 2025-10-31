import express from "express";

import { getUserEventId } from "../controllers/userEventControllers.js";

const userEventRouter = express.Router();

userEventRouter.get("/user/event/:userId", getUserEventId);

export default userEventRouter;