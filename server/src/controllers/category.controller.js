import Category from "../models/Category.models.js";
import APIError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ✅ Create Category
const createCategory = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        throw new APIError(400, "Category name is required");
    }

    const existing = await Category.findOne({ name });
    if (existing) {
        throw new APIError(400, "Category already exists");
    }

    const category = await Category.create({ name, description });

    return res
        .status(201)
        .json(new ApiResponse(201, category, "Category created successfully"));
});

// ✅ Get all categories
const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find().sort({ createdAt: -1 });
    return res
        .status(200)
        .json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

// ✅ Get category by ID
const getCategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
        throw new APIError(404, "Category not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, category, "Category fetched successfully"));
});

// ✅ Update category
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findById(id);
    if (!category) {
        throw new APIError(404, "Category not found");
    }

    if (name) category.name = name;
    if (description) category.description = description;

    await category.save();

    return res
        .status(200)
        .json(new ApiResponse(200, category, "Category updated successfully"));
});

// ✅ Delete category
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
        throw new APIError(404, "Category not found");
    }

    await category.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Category deleted successfully"));
});

export {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
