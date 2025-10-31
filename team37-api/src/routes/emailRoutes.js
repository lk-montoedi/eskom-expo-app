import {
  sendRegistrationSuccessEmail,
  sendProjectRegistrationSuccessEmail,
  sendJudgeRegistrationSuccessEmail,
  sendTeacherRegistrationSuccessEmail,
  sendProjectMarkedSuccessEmail,
} from "../utils/emailService.js";
import express from "express";

const emailRouter = express.Router();

emailRouter.post("/send-registration-email", async (req, res) => {
  const { email, userData } = req.body;

  if (!email || !userData) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  const result = await sendRegistrationSuccessEmail(email, userData);

  if (result.success) {
    res.json({ success: true, messageId: result.messageId });
  } else {
    res.status(500).json({ success: false, error: result.error });
  }
});
emailRouter.post("/send-project-registration-email", async (req, res) => {
  const { email, projectData } = req.body;

  if (!email || !projectData) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  const result = await sendProjectRegistrationSuccessEmail(email, projectData);

  if (result.success) {
    res.json({ success: true, messageId: result.messageId });
  } else {
    res.status(500).json({ success: false, error: result.error });
  }
});

emailRouter.post("/send-project-marked-email", async (req, res) => {
  const { email, projectData } = req.body;

  if (!email || !projectData) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  const result = await sendProjectMarkedSuccessEmail(email, projectData);

  if (result.success) {
    res.json({ success: true, messageId: result.messageId });
  } else {
    res.status(500).json({ success: false, error: result.error });
  }
});
emailRouter.post("/send-judge-registration-email", async (req, res) => {
  const { email, judgeData } = req.body;

  if (!email || !judgeData) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  const result = await sendJudgeRegistrationSuccessEmail(email, judgeData);

  if (result.success) {
    res.json({ success: true, messageId: result.messageId });
  } else {
    res.status(500).json({ success: false, error: result.error });
  }
});
emailRouter.post("/send-teacher-registration-email", async (req, res) => {
  const { email, teacherData } = req.body;

  if (!email || !teacherData) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  const result = await sendTeacherRegistrationSuccessEmail(email, teacherData);

  if (result.success) {
    res.json({ success: true, messageId: result.messageId });
  } else {
    res.status(500).json({ success: false, error: result.error });
  }
});
export default emailRouter;
