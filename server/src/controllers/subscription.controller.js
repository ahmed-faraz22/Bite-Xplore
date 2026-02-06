import Restaurant from "../models/Restaurant.models.js";
import APIError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Stripe from "stripe";

// Initialize Stripe with secret key from environment
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// ✅ Get subscription status
const getSubscriptionStatus = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
  
  if (!restaurant) {
    throw new APIError(404, "Restaurant profile not found. Please create your restaurant profile first in the Dashboard.");
  }

  // Check if subscription is expired
  let subscriptionStatus = restaurant.subscriptionStatus;
  let isSuspended = restaurant.isSuspended;

  if (restaurant.subscriptionStatus === "active" && restaurant.subscriptionExpiry) {
    if (new Date() > restaurant.subscriptionExpiry) {
      subscriptionStatus = "expired";
      isSuspended = true;
      restaurant.subscriptionStatus = "expired";
      restaurant.isSuspended = true;
      await restaurant.save();
    }
  }

  const freeOrdersRemaining = Math.max(0, 15 - restaurant.orderCount);
  const needsSubscription = restaurant.orderCount >= 15 && subscriptionStatus !== "active";

  return res.status(200).json(
    new ApiResponse(200, {
      orderCount: restaurant.orderCount,
      subscriptionStatus,
      subscriptionExpiry: restaurant.subscriptionExpiry,
      isSuspended,
      freeOrdersRemaining,
      needsSubscription,
      lastPaymentDate: restaurant.lastPaymentDate,
    }, "Subscription status fetched successfully")
  );
});

// ✅ Create Stripe Checkout Session
const createCheckoutSession = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
  
  if (!restaurant) {
    throw new APIError(404, "Restaurant not found");
  }

  if (!stripe) {
    throw new APIError(500, "Stripe is not configured. Please contact support.");
  }

  // Subscription amount: PKR 3,500
  // Stripe uses smallest currency unit, so 3500 PKR = 350000 paise
  const amount = 350000; // 3500 PKR in paise

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "pkr",
            product_data: {
              name: "Monthly Subscription - Bite-Xplore",
              description: "Monthly subscription for unlimited orders",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard/subscription?canceled=true`,
      client_reference_id: restaurant._id.toString(),
      metadata: {
        restaurantId: restaurant._id.toString(),
        userId: req.user._id.toString(),
      },
    });

    return res.status(200).json(
      new ApiResponse(200, {
        sessionId: session.id,
        url: session.url,
      }, "Checkout session created successfully")
    );
  } catch (error) {
    throw new APIError(500, `Stripe error: ${error.message}`);
  }
});

// ✅ Verify Stripe Payment and Activate Subscription
const verifyStripePayment = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    throw new APIError(400, "Session ID is required");
  }

  if (!stripe) {
    throw new APIError(500, "Stripe is not configured. Please contact support.");
  }

  try {
    // Retrieve the checkout session from Stripe with expanded payment_intent
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent']
    });

    // CRITICAL: Multiple checks to ensure payment was actually completed
    // 1. Check payment status
    if (session.payment_status !== "paid") {
      throw new APIError(400, `Payment not completed. Status: ${session.payment_status}`);
    }

    // 2. Check session status
    if (session.status !== "complete") {
      throw new APIError(400, `Checkout session not completed. Status: ${session.status}`);
    }

    // 3. Verify payment intent if available
    if (session.payment_intent) {
      const paymentIntent = typeof session.payment_intent === 'string' 
        ? await stripe.paymentIntents.retrieve(session.payment_intent)
        : session.payment_intent;
      
      if (paymentIntent.status !== "succeeded") {
        throw new APIError(400, `Payment intent not succeeded. Status: ${paymentIntent.status}`);
      }
    }

    // 4. Check if amount was actually paid
    if (!session.amount_total || session.amount_total === 0) {
      throw new APIError(400, "No payment amount found in session");
    }

    // Find restaurant by metadata or client_reference_id
    const restaurantId = session.metadata?.restaurantId || session.client_reference_id;
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      throw new APIError(404, "Restaurant not found");
    }

    // Verify the restaurant belongs to the authenticated user
    if (restaurant.ownerId.toString() !== req.user._id.toString()) {
      throw new APIError(403, "Unauthorized access");
    }

    // IMPORTANT: Check if subscription was already activated for this payment
    // This prevents duplicate activations if the user refreshes or calls the endpoint multiple times
    // We check if subscription was activated recently (within last 5 minutes) with same expiry
    const recentExpiry = new Date();
    recentExpiry.setMonth(recentExpiry.getMonth() + 1);
    const timeDiff = Math.abs(new Date(restaurant.lastPaymentDate || 0) - new Date());
    const fiveMinutes = 5 * 60 * 1000;

    if (restaurant.subscriptionStatus === "active" && 
        restaurant.subscriptionExpiry &&
        Math.abs(restaurant.subscriptionExpiry - recentExpiry) < 24 * 60 * 60 * 1000 && // Within 24 hours
        timeDiff < fiveMinutes) {
      // Subscription was already activated recently, return success without updating
      return res.status(200).json(
        new ApiResponse(200, {
          subscriptionStatus: restaurant.subscriptionStatus,
          subscriptionExpiry: restaurant.subscriptionExpiry,
          isSuspended: restaurant.isSuspended,
          message: "Subscription already activated"
        }, "Payment verified - subscription was already activated")
      );
    }

    // Calculate expiry date (1 month from now)
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    // Update restaurant subscription
    restaurant.subscriptionStatus = "active";
    restaurant.subscriptionExpiry = expiryDate;
    restaurant.isSuspended = false;
    restaurant.lastPaymentDate = new Date();

    await restaurant.save();

    return res.status(200).json(
      new ApiResponse(200, {
        subscriptionStatus: restaurant.subscriptionStatus,
        subscriptionExpiry: restaurant.subscriptionExpiry,
        isSuspended: restaurant.isSuspended,
        message: "Subscription activated successfully"
      }, "Payment verified and subscription activated successfully")
    );
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(500, `Payment verification failed: ${error.message}`);
  }
});

// ✅ Activate subscription (for non-Stripe payment methods)
const activateSubscription = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
  
  if (!restaurant) {
    throw new APIError(404, "Restaurant not found");
  }

  const { paymentId, paymentMethod } = req.body;

  if (!paymentId) {
    throw new APIError(400, "Payment ID is required");
  }

  // For non-Stripe methods, we'll simulate payment verification
  // In production, you would verify payment with the respective gateway
  if (paymentMethod === "credit_card") {
    throw new APIError(400, "Please use Stripe checkout for credit card payments");
  }

  // Calculate expiry date (1 month from now)
  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + 1);

  // Update restaurant subscription
  restaurant.subscriptionStatus = "active";
  restaurant.subscriptionExpiry = expiryDate;
  restaurant.isSuspended = false;
  restaurant.lastPaymentDate = new Date();

  await restaurant.save();

  return res.status(200).json(
    new ApiResponse(200, {
      subscriptionStatus: restaurant.subscriptionStatus,
      subscriptionExpiry: restaurant.subscriptionExpiry,
      isSuspended: restaurant.isSuspended,
      message: "Subscription activated successfully"
    }, "Subscription activated successfully")
  );
});

export { getSubscriptionStatus, activateSubscription, createCheckoutSession, verifyStripePayment };

