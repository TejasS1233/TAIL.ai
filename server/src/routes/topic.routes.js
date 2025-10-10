import { Router } from "express";
import { getTopics } from "../controllers/topic.controller.js";

const router = Router();

// Public route (no auth needed)
router.route("/").get(getTopics);

export default router;
