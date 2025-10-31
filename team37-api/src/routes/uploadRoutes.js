import express from "express";
import { handlePhotoUpload, handleDocumentUpload } from "../controllers/uploadControllers.js";

const router = express.Router();
router.post("/upload-photo", handlePhotoUpload);
router.post("/upload-document", handleDocumentUpload);

export default router;
