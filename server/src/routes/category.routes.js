import express from "express";
import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} from "../controllers/category.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protected routes (only logged-in users)
router.post("/", verifyJWT, createCategory);
router.get("/", getAllCategories); // public
router.get("/:id", getCategoryById); // public
router.put("/:id", verifyJWT, updateCategory);
router.delete("/:id", verifyJWT, deleteCategory);

export default router;
