import Restaurant from "../models/Restaurant.models.js";
import Product from "../models/Product.models.js";
import Review from "../models/Review.models.js";
import { MONTHLY_ORDER_LIMIT_UNPAID_COMMISSION } from "../constant.js";


export const calculateRestaurantRatings = async (restaurantId) => {
  try {
    const products = await Product.find({ restaurantId }).select("_id");
    const productIds = products.map(p => p._id);

    if (productIds.length === 0) {
      await Restaurant.findByIdAndUpdate(restaurantId, {
        averageRating: 0,
        totalRatings: 0,
        isTopRated: false
      });
      return { averageRating: 0, totalRatings: 0, isTopRated: false };
    }

    const reviews = await Review.find({ productId: { $in: productIds } }).select("rating");
    
    if (reviews.length === 0) {
      await Restaurant.findByIdAndUpdate(restaurantId, {
        averageRating: 0,
        totalRatings: 0,
        isTopRated: false
      });
      return { averageRating: 0, totalRatings: 0, isTopRated: false };
    }

    const ratings = reviews.map(r => r.rating);
    const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    const roundedRating = Math.round(averageRating * 10) / 10;

    const isTopRated = roundedRating >= 4.0 && reviews.length >= 5;

    await Restaurant.findByIdAndUpdate(restaurantId, {
      averageRating: roundedRating,
      totalRatings: reviews.length,
      isTopRated
    });

    return {
      averageRating: roundedRating,
      totalRatings: reviews.length,
      isTopRated
    };
  } catch (error) {
    console.error(`Error calculating ratings for restaurant ${restaurantId}:`, error);
    throw error;
  }
};

/**
 * Get top 10 restaurants for slider
 * Logic: 
 * 1. Filter top-rated restaurants (rating >= 4.0, at least 5 reviews)
 * 2. If <= 10, return all sorted by rating
 * 3. If > 10, sort by orders, take top 10
 */
export const getTop10RestaurantsForSlider = async () => {
  try {
    // Get all verified, top-rated restaurants
    const topRatedRestaurants = await Restaurant.find({
      verificationStatus: "verified",
      isTopRated: true
    })
      .select("_id name logo city averageRating orderCount sliderStatus")
      .lean();

    if (topRatedRestaurants.length === 0) {
      return [];
    }

    // If 10 or fewer, sort by rating (descending)
    if (topRatedRestaurants.length <= 10) {
      return topRatedRestaurants.sort((a, b) => b.averageRating - a.averageRating);
    }

    // If more than 10, sort by orderCount (descending), take top 10
    return topRatedRestaurants
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, 10)
      .sort((a, b) => b.averageRating - a.averageRating); // Then sort by rating
  } catch (error) {
    console.error("Error getting top 10 restaurants:", error);
    throw error;
  }
};

/**
 * Update slider status for restaurants
 * Sets commission amounts based on slider status
 */
export const updateSliderStatus = async () => {
  try {
    const top10 = await getTop10RestaurantsForSlider();
    const top10Ids = top10.map(r => r._id.toString());

    // Update all restaurants
    await Restaurant.updateMany(
      {},
      {
        $set: {
          sliderStatus: "not_in_slider",
          commissionType: "none",
          commissionAmount: 0
        }
      }
    );

    // Mark top 10 as in slider (5000 PKR)
    if (top10Ids.length > 0) {
      await Restaurant.updateMany(
        { _id: { $in: top10Ids } },
        {
          $set: {
            sliderStatus: "in_slider",
            commissionType: "slider",
            commissionAmount: 5000,
            sliderPaymentStatus: "unpaid"
          }
        }
      );
    }

    // Mark top-rated restaurants NOT in slider (1500 PKR if orders > 30)
    const topRatedNotInSlider = await Restaurant.find({
      verificationStatus: "verified",
      isTopRated: true,
      _id: { $nin: top10Ids },
      orderCount: { $gt: 30 }
    });

    for (const restaurant of topRatedNotInSlider) {
      await Restaurant.findByIdAndUpdate(restaurant._id, {
        sliderStatus: "not_in_slider",
        commissionType: "top_rated",
        commissionAmount: 1500,
        sliderPaymentStatus: "unpaid"
      });
    }

    return { top10Count: top10Ids.length, topRatedCount: topRatedNotInSlider.length };
  } catch (error) {
    console.error("Error updating slider status:", error);
    throw error;
  }
};

/**
 * Check monthly order limit for unpaid top-rated restaurants
 */
export const checkMonthlyOrderLimit = async (restaurantId) => {
  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return { allowed: false, message: "Restaurant not found" };
    }

    // Reset monthly count if needed (reset at the start of each month)
    const now = new Date();
    const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // If no reset date set, or if reset date is before current month's first day, reset the counter
    if (!restaurant.monthlyOrderResetDate || new Date(restaurant.monthlyOrderResetDate) < firstDayOfCurrentMonth) {
      restaurant.monthlyOrderCount = 0;
      // Set reset date to first day of next month
      restaurant.monthlyOrderResetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      await restaurant.save();
    }

    // Check if restaurant has a commission bill (slider or top-rated) and is unpaid or expired
    const hasCommissionBill = (restaurant.commissionType === "slider" || restaurant.commissionType === "top_rated") && restaurant.commissionAmount > 0;
    const isPaid = restaurant.sliderPaymentStatus === "paid" && restaurant.sliderPaymentExpiry && now <= restaurant.sliderPaymentExpiry;

    if (hasCommissionBill && !isPaid) {
      if (restaurant.monthlyOrderCount >= MONTHLY_ORDER_LIMIT_UNPAID_COMMISSION) {
        return {
          allowed: false,
          message: `Monthly order limit of ${MONTHLY_ORDER_LIMIT_UNPAID_COMMISSION} reached. Please pay the commission fee (PKR ${restaurant.commissionAmount}) to continue receiving orders. Payment is valid for 30 days.`
        };
      }
    }

    return { allowed: true, monthlyOrderCount: restaurant.monthlyOrderCount };
  } catch (error) {
    console.error("Error checking monthly order limit:", error);
    throw error;
  }
};

