import express from "express";
import {
  addReview,
  getProductReviews,
  getProductRating,
  getUserReview,
} from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/product/:productId", getProductReviews);
router.get("/product/:productId/rating", getProductRating);

// Protected routes (buyers only)
router.post("/", verifyJWT, addReview);
router.get("/product/:productId/user", verifyJWT, getUserReview);

export default router;

