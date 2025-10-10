import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createOrder, verifyPayment, getAllPayments } from "../controllers/payment.controller.js";

const router = Router();

router.post("/create-order", verifyJWT, createOrder);
router.post("/verify", verifyJWT, verifyPayment);
router.get("/all", getAllPayments);

export default router;
