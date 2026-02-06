import express from "express";
import {
  createOrder,
  getRestaurantOrders,
  getUserOrders,
  updateOrderStatus,
  createOrderCheckoutSession,
  verifyOrderPayment,
} from "../controllers/order.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { checkRestaurantSubscription } from "../middlewares/subscription.middleware.js";
import { verifyRestaurantAccess } from "../middlewares/verification.middleware.js";

const router = express.Router();

// Protected routes
// Note: Orders are created by buyers, so verification middleware is not needed here
// But sellers receiving orders should be verified (handled in getRestaurantOrders)
router.post("/", verifyJWT, checkRestaurantSubscription, createOrder);
router.post("/create-checkout-session", verifyJWT, createOrderCheckoutSession);
router.post("/verify-payment", verifyJWT, verifyOrderPayment);
router.get("/my-orders", verifyJWT, getUserOrders);
router.get("/restaurant", verifyJWT, authorizeRoles("seller"), verifyRestaurantAccess, getRestaurantOrders);
router.put("/:orderId/status", verifyJWT, authorizeRoles("seller"), updateOrderStatus);

export default router;

