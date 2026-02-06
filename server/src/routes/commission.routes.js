import express from "express";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
  getSliderRestaurants,
  getCommissionStatus,
  createCommissionCheckoutSession,
  verifyCommissionPayment,
  getAllCommissionStatus,
  recalculateSlider
} from "../controllers/commission.controller.js";

const router = express.Router();

// Public routes
router.get("/slider", getSliderRestaurants);

// Seller routes
router.get("/status", verifyJWT, authorizeRoles("seller"), getCommissionStatus);
router.post("/create-checkout-session", verifyJWT, authorizeRoles("seller"), createCommissionCheckoutSession);
router.post("/verify-payment", verifyJWT, authorizeRoles("seller"), verifyCommissionPayment);

// Admin routes
router.get("/all", verifyJWT, authorizeRoles("admin"), getAllCommissionStatus);
router.post("/recalculate-slider", verifyJWT, authorizeRoles("admin"), recalculateSlider);

export default router;

