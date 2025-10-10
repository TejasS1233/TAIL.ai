import { Router } from "express";
import { handleChat } from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, handleChat);

export default router;
