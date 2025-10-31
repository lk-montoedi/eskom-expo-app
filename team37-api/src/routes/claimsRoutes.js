import express from "express";
import { createClaim, approveClaim, getJudgeClaims } from "../controllers/claimsController.js";

const claimsRouter = express.Router();

claimsRouter.post("/", createClaim);
claimsRouter.put("/approve/:claimId", approveClaim);
claimsRouter.get("/judge/:userId", getJudgeClaims);

export default claimsRouter;
