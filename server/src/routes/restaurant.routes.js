import express from "express";
import multer from "multer";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
  getMyRestaurant,
  updateMyRestaurant,
  createMyRestaurant,
  getAllRestaurants,
  getAllCities,
} from "../controllers/restaurant.controller.js";

const router = express.Router();

// ✅ Multer config for logo upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// ✅ Public routes for filtering
router.get("/", getAllRestaurants);

// ✅ Seller only routes
router.get("/my-restaurant", verifyJWT, authorizeRoles("seller"), getMyRestaurant);
router.post("/my-restaurant", verifyJWT, authorizeRoles("seller"), upload.single("logo"), createMyRestaurant);
router.put("/my-restaurant", verifyJWT, authorizeRoles("seller"), upload.single("logo"), updateMyRestaurant);

export default router;
