import { Router } from "express";
import {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  allMessages,
  sendMessage,
  searchUsers,
} from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, accessChat);
router.route("/").get(verifyJWT, fetchChats);
router.route("/search").get(verifyJWT, searchUsers);
router.route("/group").post(verifyJWT, createGroupChat);
router.route("/rename").put(verifyJWT, renameGroup);
router.route("/groupremove").put(verifyJWT, removeFromGroup);
router.route("/groupadd").put(verifyJWT, addToGroup);
router.route("/:chatId").get(verifyJWT, allMessages);
router.route("/").post(verifyJWT, sendMessage);

export default router;
