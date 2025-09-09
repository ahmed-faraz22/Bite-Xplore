import express from "express";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
  getMyRestaurant,
  updateMyRestaurant,
  createMyRestaurant,
} from "../controllers/restaurant.controller.js";

const router = express.Router();

// ✅ Seller only routes
router.get("/my-restaurant", verifyJWT, authorizeRoles("seller"), getMyRestaurant);
router.post("/my-restaurant", verifyJWT, authorizeRoles("seller"), createMyRestaurant); // 🔑 Add this
router.put("/my-restaurant", verifyJWT, authorizeRoles("seller"), updateMyRestaurant);

export default router;
