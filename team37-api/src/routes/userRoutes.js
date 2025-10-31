import express from "express";
import {
  login,
  judgeRegistration,
  learnerRegistration,
  teacherRegistration,
  getJudgeProfile,
  updateJudgeProfile,
  removeJudgeProfilePicture,
  updateUserProfile,
  updateUserPassword,
  getUserProfile,
  teacherLearnerRegistration,
  getAllUsersInfo,
  getTeacherSchool,
  getJudgeDetails,
} from "../controllers/userControllers.js";

import { emailVerification } from "../auth/emailVerifications.js";

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/register/learner", learnerRegistration);
userRouter.post("/learner", teacherLearnerRegistration);
userRouter.post("/register/teacher", teacherRegistration);
userRouter.post("/register/judge", judgeRegistration);
userRouter.get("/get/userProfile/:userId", getUserProfile);
userRouter.get("/profile/:userId", getJudgeProfile);
userRouter.put("/profile/:userId", updateJudgeProfile);
userRouter.put("/profile/:userId/remove-picture", removeJudgeProfilePicture);
userRouter.post("/check/user", emailVerification);
userRouter.put("/update/user/profile/:userId", updateUserProfile);
userRouter.put("/update/user/password/:userId", updateUserPassword);
userRouter.get("/userprofile/:userId", getUserProfile);
userRouter.get("/userprofile", getAllUsersInfo);
userRouter.get("/get/school/info/:teacherId", getTeacherSchool);
userRouter.get("/get/details/:userId", getJudgeDetails);

export default userRouter;
