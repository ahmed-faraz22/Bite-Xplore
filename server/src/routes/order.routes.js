import express from "express";
import {
  createOrder,
  getRestaurantOrders,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { checkRestaurantSubscription } from "../middlewares/subscription.middleware.js";

const router = express.Router();

// Protected routes
router.post("/", verifyJWT, checkRestaurantSubscription, createOrder);
router.get("/my-orders", verifyJWT, getUserOrders);
router.get("/restaurant", verifyJWT, authorizeRoles("seller"), getRestaurantOrders);
router.put("/:orderId/status", verifyJWT, authorizeRoles("seller"), updateOrderStatus);

export default router;

