import Restaurant from "../models/Restaurant.models.js";
import APIError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ✅ Check if restaurant can receive orders
export const checkRestaurantSubscription = asyncHandler(async (req, res, next) => {
  const { restaurantId } = req.body;

  if (!restaurantId) {
    return next(); // Let the order creation handle this error
  }

  const restaurant = await Restaurant.findById(restaurantId);
  
  if (!restaurant) {
    throw new APIError(404, "Restaurant not found");
  }

  // Check if subscription is expired
  if (restaurant.subscriptionStatus === "active" && restaurant.subscriptionExpiry) {
    if (new Date() > restaurant.subscriptionExpiry) {
      restaurant.subscriptionStatus = "expired";
      restaurant.isSuspended = true;
      await restaurant.save();
    }
  }

  // Check if restaurant is suspended
  if (restaurant.isSuspended || restaurant.subscriptionStatus === "expired") {
    throw new APIError(403, "Restaurant subscription has expired. Please renew your subscription to continue receiving orders.");
  }

  // Check if restaurant has exceeded free orders
  if (restaurant.orderCount >= 15 && restaurant.subscriptionStatus !== "active") {
    throw new APIError(403, "You have reached the free order limit (15 orders). Please subscribe to continue receiving orders.");
  }

  // Attach restaurant to request for use in order creation
  req.restaurant = restaurant;
  next();
});



