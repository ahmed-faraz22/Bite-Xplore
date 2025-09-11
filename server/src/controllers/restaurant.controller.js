import Restaurant from "../models/Restaurant.models.js";
import APIError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ✅ Create restaurant profile (first time)
export const createMyRestaurant = asyncHandler(async (req, res) => {
  const { name, address, phone, hasOwnDelivery } = req.body;

  // Check if restaurant already exists for this owner
  const existing = await Restaurant.findOne({ ownerId: req.user._id });
  if (existing) {
    throw new APIError(400, "Restaurant already exists. Use update instead.");
  }

  const restaurant = await Restaurant.create({
    ownerId: req.user._id,
    name,
    address,
    phone,
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
  const { name, address, phone, hasOwnDelivery } = req.body;

  const restaurant = await Restaurant.findOneAndUpdate(
    { ownerId: req.user._id },
    { name, address, phone, hasOwnDelivery },
    { new: true, runValidators: true }
  );

  if (!restaurant) {
    throw new APIError(404, "No restaurant profile found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, restaurant, "Restaurant profile updated successfully"));
});
