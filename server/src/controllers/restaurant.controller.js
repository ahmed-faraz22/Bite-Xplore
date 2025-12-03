import Restaurant from "../models/Restaurant.models.js";
import APIError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

// ✅ Create restaurant profile (first time)
export const createMyRestaurant = asyncHandler(async (req, res) => {
  const { name, address, city, phone, hasOwnDelivery } = req.body;

  if (!city) {
    throw new APIError(400, "City is required");
  }

  // Check if restaurant already exists for this owner
  const existing = await Restaurant.findOne({ ownerId: req.user._id });
  if (existing) {
    throw new APIError(400, "Restaurant already exists. Use update instead.");
  }

  // Handle logo upload
  let logoUrl = null;
  if (req.file) {
    const result = await uploadOnCloudinary(req.file.path, 'restaurants');
    if (result) logoUrl = result.secure_url;
  }

  const restaurant = await Restaurant.create({
    ownerId: req.user._id,
    name,
    address,
    city,
    phone,
    logo: logoUrl,
    hasOwnDelivery,
  });

  res
    .status(201)
    .json(new ApiResponse(201, restaurant, "Restaurant profile created successfully"));
});

// ✅ Get my restaurant
export const getMyRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
  if (!restaurant) {
    throw new APIError(404, "No restaurant profile found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, restaurant, "Restaurant profile fetched successfully"));
});

// ✅ Update my restaurant
export const updateMyRestaurant = asyncHandler(async (req, res) => {
  const { name, address, city, phone, hasOwnDelivery } = req.body;

  const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
  if (!restaurant) {
    throw new APIError(404, "No restaurant profile found");
  }

  // Handle logo upload
  if (req.file) {
    // Delete old logo if exists
    if (restaurant.logo) {
      try {
        const publicId = restaurant.logo.split("/").pop().split(".")[0];
        await deleteFromCloudinary(publicId);
      } catch (err) {
        console.error("Failed to delete old logo:", err);
      }
    }
    
    // Upload new logo
    const result = await uploadOnCloudinary(req.file.path, 'restaurants');
    if (result) restaurant.logo = result.secure_url;
  }

  // Update other fields
  const updateData = { name, address, phone, hasOwnDelivery, logo: restaurant.logo };
  if (city) updateData.city = city;

  const updatedRestaurant = await Restaurant.findOneAndUpdate(
    { ownerId: req.user._id },
    updateData,
    { new: true, runValidators: true }
  );

  res
    .status(200)
    .json(new ApiResponse(200, updatedRestaurant, "Restaurant profile updated successfully"));
});

// ✅ Get all restaurants (public endpoint for filtering)
export const getAllRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find()
    .select("name city address phone logo")
    .sort({ name: 1 });

  res
    .status(200)
    .json(restaurants);
});

// ✅ Get all unique cities (public endpoint for filtering)
export const getAllCities = asyncHandler(async (req, res) => {
  const cities = await Restaurant.distinct("city");
  
  // Format as array of objects with id and name for frontend compatibility
  const citiesList = cities
    .filter(city => city) // Remove null/undefined
    .map((city, index) => ({
      id: index + 1,
      name: city
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  res
    .status(200)
    .json(citiesList);
});
