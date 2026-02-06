import express from "express";
import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} from "../controllers/category.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// Admin-only routes (only admins can create, update, delete categories)
router.post("/", verifyJWT, authorizeRoles("admin"), createCategory);
router.put("/:id", verifyJWT, authorizeRoles("admin"), updateCategory);
router.delete("/:id", verifyJWT, authorizeRoles("admin"), deleteCategory);

export default router;
