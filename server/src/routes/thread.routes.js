import { Router } from "express";
import {
  getAllThreads,
  getAllThreadsWithRepliesCount,
  createThread,
  getThread,
  getThreadReplies,
  createReply,
  getThreadWithRepliesCount,
  likeThread,
  dislikeThread,
  pinThread,
  pinThreadOnly,
  unpinThread,
} from "../controllers/thread.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Public routes
router.route("/").get(getAllThreads);
router.route("/with-replies-count").get(getAllThreadsWithRepliesCount);

// Thread CRUD with authentication
router.route("/create").post(verifyJWT, upload.single("image"), createThread);
router.route("/:threadId").get(getThread);
router.route("/:threadId/with-replies-count").get(getThreadWithRepliesCount);

// Reply routes
router.route("/:threadId/replies").get(getThreadReplies);
router.route("/:threadId/replies").post(verifyJWT, upload.single("image"), createReply);

// Like/Dislike routes (works for both threads and replies)
router.route("/:threadId/like").post(verifyJWT, likeThread);
router.route("/:threadId/dislike").post(verifyJWT, dislikeThread);

// Officer/Admin only - Pin/Unpin operations
router.route("/:threadId/pin").post(verifyJWT, pinThread); // toggle
router.route("/:threadId/pin-only").post(verifyJWT, pinThreadOnly);
router.route("/:threadId/unpin").post(verifyJWT, unpinThread);

export default router;