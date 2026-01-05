import express from "express";
import {
  getSubscriptionStatus,
  activateSubscription,
  createCheckoutSession,
  verifyStripePayment,
} from "../controllers/subscription.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protected routes (seller only)
router.get("/status", verifyJWT, authorizeRoles("seller"), getSubscriptionStatus);
router.post("/activate", verifyJWT, authorizeRoles("seller"), activateSubscription);

// Stripe payment routes
router.post("/create-checkout-session", verifyJWT, authorizeRoles("seller"), createCheckoutSession);
router.post("/verify-payment", verifyJWT, authorizeRoles("seller"), verifyStripePayment);

export default router;



