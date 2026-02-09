import Restaurant from "../models/Restaurant.models.js";
import Category from "../models/Category.models.js";
import Order from "../models/Order.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Admin: Get dashboard stats (counts for pending verifications, restaurants, categories, orders)
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [pendingVerifications, totalRestaurants, totalCategories, totalOrders] =
    await Promise.all([
      Restaurant.countDocuments({
        verificationStatus: { $in: ["pending", "manual_review"] },
      }),
      Restaurant.countDocuments(),
      Category.countDocuments(),
      Order.countDocuments(),
    ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        pendingVerifications,
        totalRestaurants,
        totalCategories,
        totalOrders,
      },
      "Dashboard stats retrieved successfully"
    )
  );
});
