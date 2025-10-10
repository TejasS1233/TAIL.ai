import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateCurrentUser,
  updateUserAvatar,
  getUserProfile,
  saveFCMToken,
  updateWorkerLocation,
  getUsers,
  getNearbyWorkers,
  googleOAuthLogin,
} from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public Routes
router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);
router.post("/oauth/google", googleOAuthLogin);
router.post("/refresh-token", refreshAccessToken);
router.get("/", getUsers);

// Authenticated Routes
router.post("/logout", verifyJWT, logoutUser);
router.post("/change-password", verifyJWT, changeCurrentPassword);
router.get("/me", verifyJWT, getCurrentUser);
router.patch("/me", verifyJWT, updateCurrentUser);
router.patch("/me/avatar", verifyJWT, upload.single("avatar"), updateUserAvatar);
router.get("/profile/:id", getUserProfile);
router.post("/save-fcm-token", verifyJWT, saveFCMToken);
router.patch("/get-current-location", verifyJWT, updateWorkerLocation);
router.get("/nearby/:id", getNearbyWorkers);
export default router;
