import Product from "../models/Product.models.js";
import APIError from "../utils/ApiError.js";
import Restaurant from "../models/Restaurant.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

// ✅ Create Product
const createProduct = asyncHandler(async (req, res) => {
  const { restaurantId, categoryId, name, description, price } = req.body;

  if (!restaurantId || !categoryId || !name || !price) {
    throw new APIError(400, "All required fields must be provided");
  }

  let images = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await uploadOnCloudinary(file.path);
      if (result) images.push(result.secure_url);
    }
  }

  const product = await Product.create({
    restaurantId,
    categoryId,
    name,
    description,
    price,
    images,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

// ✅ Get All Products
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate("restaurantId", "name")
    .populate("categoryId", "name")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

// ✅ Get Product by ID
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id)
    .populate("restaurantId", "name")
    .populate("categoryId", "name");

  if (!product) {
    throw new APIError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

// ✅ Update Product
// ✅ Update Product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, price, categoryId, available } = req.body;

  const product = await Product.findById(id);
  if (!product) throw new APIError(404, "Product not found");

  const restaurant = await Restaurant.findById(product.restaurantId);
  if (!restaurant) throw new APIError(404, "Restaurant not found");

  // Check ownership
  if (
    req.user.role !== "admin" &&
    req.user._id.toString() !== restaurant.ownerId.toString()
  ) {
    throw new APIError(403, "You are not allowed to update this product");
  }

  // If new images uploaded, delete old images from Cloudinary and upload new ones
  if (req.files && req.files.length > 0) {
    // Delete old images
    if (product.images && product.images.length > 0) {
      for (const url of product.images) {
        try {
          const publicId = url.split("/").pop().split(".")[0];
          await deleteFromCloudinary(publicId);
        } catch (err) {
          console.error("Failed to delete image:", err);
        }
      }
    }

    // Upload new images
    const uploadedImages = [];
    for (const file of req.files) {
      const result = await uploadOnCloudinary(file.path);
      if (result) uploadedImages.push(result.secure_url);
    }
    product.images = uploadedImages;
  }

  // Update fields
  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.categoryId = categoryId || product.categoryId;
  if (available !== undefined) product.available = available;

  await product.save();

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully"));
});



// ✅ Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find the product
  const product = await Product.findById(id);
  if (!product) {
    throw new APIError(404, "Product not found");
  }

  // Find the restaurant associated with this product
  const restaurant = await Restaurant.findById(product.restaurantId);
  if (!restaurant) {
    throw new APIError(404, "Restaurant not found");
  }

  // Only admin or restaurant owner can delete
  if (req.user.role !== "admin" && req.user._id.toString() !== restaurant.ownerId.toString()) {
    throw new APIError(403, "You are not allowed to delete this product");
  }

  // Delete images from Cloudinary
  if (product.images && product.images.length > 0) {
    for (const url of product.images) {
      try {
        const publicId = url.split("/").pop().split(".")[0]; // extract publicId from URL
        await deleteFromCloudinary(publicId);
      } catch (err) {
        console.error("Failed to delete image from Cloudinary:", err);
      }
    }
  }

  // Delete the product
  await product.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Product deleted successfully"));
});

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
