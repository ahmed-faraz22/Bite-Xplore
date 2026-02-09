import Restaurant from "../models/Restaurant.models.js";
import APIError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  calculateRestaurantRatings,
  getTop10RestaurantsForSlider,
  updateSliderStatus,
  checkMonthlyOrderLimit
} from "../utils/restaurantRating.util.js";
import Stripe from "stripe";

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

/**
 * Get restaurants for slider (public)
 * Returns only restaurants with sliderStatus === "in_slider" from DB,
 * so the homepage slider matches the Admin Commission tab exactly.
 */
export const getSliderRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find({
    verificationStatus: "verified",
    sliderStatus: "in_slider"
  })
    .select("_id name logo city averageRating totalRatings orderCount sliderStatus")
    .sort({ averageRating: -1, orderCount: -1 })
    .limit(10)
    .lean();

  res.status(200).json(
    new ApiResponse(200, restaurants, "Slider restaurants fetched successfully")
  );
});

/**
 * Get restaurant commission status (seller)
 */
export const getCommissionStatus = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
  
  if (!restaurant) {
    throw new APIError(404, "Restaurant not found");
  }

  // Recalculate ratings
  await calculateRestaurantRatings(restaurant._id);

  // Get fresh data
  const freshRestaurant = await Restaurant.findById(restaurant._id);

  res.status(200).json(
    new ApiResponse(200, {
      averageRating: freshRestaurant.averageRating,
      totalRatings: freshRestaurant.totalRatings,
      isTopRated: freshRestaurant.isTopRated,
      sliderStatus: freshRestaurant.sliderStatus,
      commissionType: freshRestaurant.commissionType,
      commissionAmount: freshRestaurant.commissionAmount,
      sliderPaymentStatus: freshRestaurant.sliderPaymentStatus,
      sliderPaymentExpiry: freshRestaurant.sliderPaymentExpiry,
      monthlyOrderCount: freshRestaurant.monthlyOrderCount,
      orderCount: freshRestaurant.orderCount
    }, "Commission status fetched successfully")
  );
});

/**
 * Create commission payment checkout session (Stripe)
 */
export const createCommissionCheckoutSession = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
  
  if (!restaurant) {
    throw new APIError(404, "Restaurant not found");
  }

  if (!restaurant.commissionAmount || restaurant.commissionAmount === 0) {
    throw new APIError(400, "No commission fee required");
  }

  if (restaurant.sliderPaymentStatus === "paid" && restaurant.sliderPaymentExpiry && new Date() < restaurant.sliderPaymentExpiry) {
    throw new APIError(400, "Commission already paid for this month");
  }

  if (!stripe) {
    throw new APIError(500, "Stripe is not configured");
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "pkr",
            product_data: {
              name: restaurant.sliderStatus === "in_slider" 
                ? "Slider Placement Fee" 
                : "Top-Rated Restaurant Commission",
              description: restaurant.sliderStatus === "in_slider"
                ? `Monthly fee for slider placement on landing page - ${restaurant.name}`
                : `Monthly commission fee for top-rated restaurant - ${restaurant.name}`,
            },
            unit_amount: restaurant.commissionAmount * 100, // Convert to paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard/commission?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard/commission?canceled=true`,
      metadata: {
        restaurantId: restaurant._id.toString(),
        commissionType: restaurant.commissionType,
        amount: restaurant.commissionAmount.toString(),
      },
      client_reference_id: restaurant._id.toString(),
    });

    res.status(200).json(
      new ApiResponse(200, { url: session.url }, "Checkout session created successfully")
    );
  } catch (error) {
    console.error("Stripe checkout error:", error);
    throw new APIError(500, `Failed to create checkout session: ${error.message}`);
  }
});

/**
 * Verify commission payment
 */
export const verifyCommissionPayment = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    throw new APIError(400, "Session ID is required");
  }

  if (!stripe) {
    throw new APIError(500, "Stripe is not configured");
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent']
    });

    // Verify payment status
    if (session.payment_status !== "paid" || session.status !== "complete") {
      throw new APIError(400, "Payment not completed");
    }

    if (session.amount_total === 0) {
      throw new APIError(400, "Invalid payment amount");
    }

    const restaurantId = session.metadata?.restaurantId || session.client_reference_id;
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      throw new APIError(404, "Restaurant not found");
    }

    // Verify the restaurant belongs to the authenticated user
    if (restaurant.ownerId.toString() !== req.user._id.toString()) {
      throw new APIError(403, "Unauthorized access");
    }

    // Check if payment was already processed
    if (restaurant.sliderPaymentStatus === "paid" && restaurant.sliderPaymentExpiry && new Date() < restaurant.sliderPaymentExpiry) {
      throw new APIError(400, "Payment already processed");
    }

    // Update restaurant payment status
    const now = new Date();
    const expiryDate = new Date(now);
    expiryDate.setMonth(expiryDate.getMonth() + 1); // 1 month from now

    restaurant.sliderPaymentStatus = "paid";
    restaurant.sliderPaymentExpiry = expiryDate;
    restaurant.sliderPaymentDate = now;
    restaurant.monthlyOrderCount = 0; // Reset monthly order count
    restaurant.monthlyOrderResetDate = new Date(expiryDate.getFullYear(), expiryDate.getMonth() + 1, 1);
    await restaurant.save();

    res.status(200).json(
      new ApiResponse(200, {
        restaurant,
        expiryDate
      }, "Commission payment verified successfully")
    );
  } catch (error) {
    console.error("Payment verification error:", error);
    throw new APIError(500, `Payment verification failed: ${error.message}`);
  }
});

/**
 * Admin: Get all restaurants with commission status
 */
export const getAllCommissionStatus = asyncHandler(async (req, res) => {
  // Recalculate slider status
  await updateSliderStatus();

  const restaurants = await Restaurant.find({ verificationStatus: "verified" })
    .populate("ownerId", "name email")
    .select("name city averageRating totalRatings isTopRated sliderStatus commissionType commissionAmount sliderPaymentStatus sliderPaymentExpiry orderCount monthlyOrderCount")
    .sort({ averageRating: -1, orderCount: -1 });

  res.status(200).json(
    new ApiResponse(200, restaurants, "All commission statuses fetched successfully")
  );
});

/**
 * Admin: Recalculate slider status
 */
export const recalculateSlider = asyncHandler(async (req, res) => {
  // Recalculate all restaurant ratings first
  const restaurants = await Restaurant.find({ verificationStatus: "verified" });
  
  for (const restaurant of restaurants) {
    await calculateRestaurantRatings(restaurant._id);
  }

  // Update slider status
  const result = await updateSliderStatus();

  res.status(200).json(
    new ApiResponse(200, result, "Slider status recalculated successfully")
  );
});

