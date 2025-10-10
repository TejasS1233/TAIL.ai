import { Router } from "express";
import {
  getUserNotifications,
  getUnreadNotifications,
  markNotificationsAsRead,
  deleteNotifications,
} from "../controllers/notification.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verifyJWT, getUserNotifications);
router.get("/unread", verifyJWT, getUnreadNotifications);
router.patch("/mark-read", verifyJWT, markNotificationsAsRead);
router.delete("/", verifyJWT, deleteNotifications);

export default router;
