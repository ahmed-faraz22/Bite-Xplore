import Restaurant from "../models/Restaurant.models.js";
import APIError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Middleware to verify restaurant access
 * Blocks access to:
 * - Receiving orders
 * - Publishing menus
 * - Going live
 * 
 * Only allows access if restaurant.verificationStatus === "verified"
 * Admins can bypass this check
 */
export const verifyRestaurantAccess = asyncHandler(async (req, res, next) => {
  // Allow admins to bypass verification
  if (req.user.role === "admin") {
    return next();
  }

  // Find restaurant by ownerId
  const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
  
  if (!restaurant) {
    throw new APIError(404, "Restaurant profile not found. Please create your restaurant profile first.");
  }

  // Check verification status
  if (restaurant.verificationStatus !== "verified") {
    let message = "Your restaurant is not verified yet. ";
    
    if (restaurant.verificationStatus === "pending") {
      message += "Your verification is pending. Please wait for admin approval or complete the verification process.";
    } else if (restaurant.verificationStatus === "manual_review") {
      message += "Your restaurant is under manual review. Please wait for admin approval.";
    } else if (restaurant.verificationStatus === "rejected") {
      message += restaurant.verificationRejectionReason 
        ? `Verification was rejected: ${restaurant.verificationRejectionReason}` 
        : "Verification was rejected. Please contact support.";
    }
    
    throw new APIError(403, message);
  }

  // Attach restaurant to request for use in controllers
  req.restaurant = restaurant;
  next();
});

