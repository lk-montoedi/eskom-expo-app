import express from "express";
import {
  getEthicsMarksheetById,
  updateEthicsMarksheet,
  createEthicsMarksheet,
} from "../controllers/marksheetControllers.js";

const router = express.Router();

// Route to get an ethics marksheet by its ID
router.get("/:id", getEthicsMarksheetById);

// Route to update an ethics marksheet by its ID
router.put("/:id", updateEthicsMarksheet);

// Route to create a new ethics marksheet
router.post("/", createEthicsMarksheet);

export default router;
