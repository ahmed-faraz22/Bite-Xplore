import express from "express";
import multer from "multer";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { verifyRestaurantAccess } from "../middlewares/verification.middleware.js";

const router = express.Router();

// ✅ Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Protected routes (seller/admin)
// Note: Admin can bypass verification, but sellers need to be verified to publish menus
router.post("/", verifyJWT, authorizeRoles("seller", "admin"), verifyRestaurantAccess, upload.array("images"), createProduct);
router.put("/:id", verifyJWT, authorizeRoles("seller", "admin"), verifyRestaurantAccess, upload.array("images"), updateProduct);
router.delete("/:id", verifyJWT, authorizeRoles("seller", "admin"), verifyRestaurantAccess, deleteProduct);

export default router;
