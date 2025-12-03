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

// ✅ Get All Products with Filters
const getAllProducts = asyncHandler(async (req, res) => {
  const { categories, location, restaurant } = req.query;

  // Build filter query
  let filter = {};

  // Filter by categories (comma-separated category IDs)
  if (categories) {
    const categoryIds = categories.split(",").map(id => id.trim());
    filter.categoryId = { $in: categoryIds };
  }

  // Build restaurant filter (city and/or restaurant name)
  let restaurantFilter = {};
  if (location) {
    restaurantFilter.city = { $regex: new RegExp(location, "i") };
  }
  if (restaurant) {
    restaurantFilter.name = { $regex: new RegExp(restaurant, "i") };
  }

  // If we have restaurant filters, find matching restaurant IDs
  if (Object.keys(restaurantFilter).length > 0) {
    const restaurants = await Restaurant.find(restaurantFilter).select("_id");
    const restaurantIds = restaurants.map(r => r._id);
    
    if (restaurantIds.length === 0) {
      // No restaurants match, return empty result
      return res
        .status(200)
        .json(new ApiResponse(200, [], "No products found for the selected filters"));
    }
    
    filter.restaurantId = { $in: restaurantIds };
  }

  // Only show available products
  filter.available = true;

  const products = await Product.find(filter)
    .populate("restaurantId", "name address city phone")
    .populate("categoryId", "name")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

// ✅ Get Product by ID with Restaurant Menu
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id)
    .populate("restaurantId", "name address city phone logo hasOwnDelivery")
    .populate("categoryId", "name");

  if (!product) {
    throw new APIError(404, "Product not found");
  }

  // Get all products (menu items) from the same restaurant
  const restaurantMenu = await Product.find({ 
    restaurantId: product.restaurantId,
    available: true 
  })
    .populate("categoryId", "name")
    .select("name description price images categoryId")
    .sort({ createdAt: -1 });

  // Combine product with restaurant menu
  const productWithMenu = {
    ...product.toObject(),
    restaurantMenu: restaurantMenu
  };

  return res
    .status(200)
    .json(new ApiResponse(200, productWithMenu, "Product fetched successfully"));
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
