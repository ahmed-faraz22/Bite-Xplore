import Order from "../models/Order.models.js";
import Restaurant from "../models/Restaurant.models.js";
import Cart from "../models/Cart.models.js";
import Product from "../models/Product.models.js";
import APIError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { checkMonthlyOrderLimit } from "../utils/restaurantRating.util.js";
import { PLATFORM_DELIVERY_FEE } from "../constant.js";
import Stripe from "stripe";

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// ✅ Create Order from Cart
const createOrder = asyncHandler(async (req, res) => {
  const { restaurantId, paymentMethod, deliveryBy } = req.body;

  if (!restaurantId || !deliveryBy) {
    throw new APIError(400, "Restaurant ID and delivery method are required");
  }

  // Only online payment is allowed now
  const finalPaymentMethod = paymentMethod || "online";
  if (finalPaymentMethod !== "online") {
    throw new APIError(400, "Only online payment is accepted. COD is no longer available.");
  }

  // Get restaurant and check subscription
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    throw new APIError(404, "Restaurant not found");
  }

  // Check subscription status
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

  // Check if restaurant has exceeded free orders (basic subscription)
  if (restaurant.orderCount >= 15 && restaurant.subscriptionStatus !== "active") {
    throw new APIError(403, "You have reached the free order limit (15 orders). Please subscribe to continue receiving orders.");
  }

  // Check monthly order limit for unpaid top-rated restaurants (commission system)
  const monthlyLimitCheck = await checkMonthlyOrderLimit(restaurantId);
  if (!monthlyLimitCheck.allowed) {
    throw new APIError(403, monthlyLimitCheck.message);
  }

  // Get cart items with product and restaurant info
  const cart = await Cart.findOne({ buyerId: req.user._id })
    .populate({
      path: "items.productId",
      populate: {
        path: "restaurantId",
        select: "name"
      }
    });
  
  if (!cart || !cart.items || cart.items.length === 0) {
    throw new APIError(400, "Cart is empty");
  }

  // Filter items for this restaurant and validate
  const restaurantItems = [];
  let totalPrice = 0;

  for (const item of cart.items) {
    const product = await Product.findById(item.productId._id || item.productId)
      .populate("restaurantId", "name");
    if (!product) continue;
    
    if (product.restaurantId.toString() !== restaurantId) {
      continue; // Skip items from other restaurants
    }

    // Check stock availability
    if (product.stock === 0) {
      throw new APIError(400, `${product.name} is not available`);
    }

    if (item.quantity > product.stock) {
      throw new APIError(400, `Only ${product.stock} ${product.name} available`);
    }

    const itemPrice = product.price * item.quantity;
    totalPrice += itemPrice;

    restaurantItems.push({
      productId: product._id,
      quantity: item.quantity,
      price: product.price,
    });
  }

  if (restaurantItems.length === 0) {
    throw new APIError(400, "No items found for this restaurant in your cart");
  }

  // Check if restaurant has account details for payment transfer
  if (!restaurant.paymentDetails || !restaurant.paymentDetails.accountNumber) {
    throw new APIError(400, "Restaurant has not set up payment account details. Please contact the restaurant.");
  }

  // Calculate delivery fee (only for platform delivery)
  const deliveryFee = deliveryBy === "platform" ? PLATFORM_DELIVERY_FEE : 0;
  const finalTotalPrice = totalPrice + deliveryFee;

  // Split payment:
  // - restaurantAmount: food items only (no delivery fee)
  // - platformAmount: delivery fee (only if platform delivery)
  const restaurantAmount = totalPrice;
  const platformAmount = deliveryFee;

  // Create order with split payment tracking
  const order = await Order.create({
    buyerId: req.user._id,
    restaurantId,
    items: restaurantItems,
    totalPrice: finalTotalPrice, // Total includes delivery fee
    deliveryFee: deliveryFee,
    restaurantAmount: restaurantAmount, // Amount to be paid to restaurant (food only)
    platformAmount: platformAmount, // Amount to be paid to platform (delivery fee)
    paymentMethod: finalPaymentMethod,
    deliveryBy,
    paymentStatus: "paid", // Online payment is always paid
  });

  // Increment restaurant order count and monthly order count
  restaurant.orderCount += 1;
  
  // Reset monthly count if needed (reset at the start of each month)
  const now = new Date();
  const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  // If no reset date set, or if reset date is before current month's first day, reset the counter
  if (!restaurant.monthlyOrderResetDate || new Date(restaurant.monthlyOrderResetDate) < firstDayOfCurrentMonth) {
    restaurant.monthlyOrderCount = 0;
    restaurant.monthlyOrderResetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }
  
  // Only increment monthly count for unpaid top-rated restaurants
  if (restaurant.commissionType === "top_rated" && restaurant.sliderPaymentStatus !== "paid") {
    restaurant.monthlyOrderCount += 1;
  }
  
  await restaurant.save();

  // Clear cart items for this restaurant
  cart.items = cart.items.filter(
    (item) => {
      const productId = item.productId._id || item.productId;
      return !restaurantItems.some(ri => ri.productId.toString() === productId.toString());
    }
  );
  await cart.save();

  return res.status(201).json(
    new ApiResponse(201, order, "Order created successfully")
  );
});

// ✅ Get Restaurant Orders
const getRestaurantOrders = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
  if (!restaurant) {
    throw new APIError(404, "Restaurant not found");
  }

  const orders = await Order.find({ restaurantId: restaurant._id })
    .populate("buyerId", "name email phone")
    .populate("items.productId", "name images")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, orders, "Orders fetched successfully")
  );
});

// ✅ Get User Orders
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyerId: req.user._id })
    .populate("restaurantId", "name logo")
    .populate("items.productId", "name images")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, orders, "Orders fetched successfully")
  );
});

// ✅ Update Order Status (Restaurant)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    throw new APIError(404, "Order not found");
  }

  const restaurant = await Restaurant.findById(order.restaurantId);
  if (!restaurant || restaurant.ownerId.toString() !== req.user._id.toString()) {
    throw new APIError(403, "You are not authorized to update this order");
  }

  order.status = status;
  if (status === "confirmed" && !order.restaurantConfirmation) {
    order.restaurantConfirmation = true;
    order.confirmedAt = new Date();
    
    // Add payment to restaurant total earnings when order is confirmed
    if (order.restaurantAmount && order.restaurantAmount > 0) {
      restaurant.totalEarnings = (restaurant.totalEarnings || 0) + order.restaurantAmount;
      restaurant.totalOrdersEarnings = (restaurant.totalOrdersEarnings || 0) + order.restaurantAmount;
      restaurant.lastEarningDate = new Date();
      await restaurant.save();
    }
  }
  await order.save();

  return res.status(200).json(
    new ApiResponse(200, order, "Order status updated successfully")
  );
});

// ✅ Create Stripe Checkout Session for Orders
const createOrderCheckoutSession = asyncHandler(async (req, res) => {
  const { restaurantGroups } = req.body;

  if (!restaurantGroups || !Array.isArray(restaurantGroups) || restaurantGroups.length === 0) {
    throw new APIError(400, "Restaurant groups are required");
  }

  // Validate that each restaurant group has deliveryBy
  for (const group of restaurantGroups) {
    if (!group.deliveryBy || !["restaurant", "platform"].includes(group.deliveryBy)) {
      throw new APIError(400, `Delivery method is required for restaurant ${group.restaurantId}`);
    }
  }

  if (!stripe) {
    throw new APIError(500, "Stripe is not configured. Please contact support.");
  }

  // Get cart to validate items
  const cart = await Cart.findOne({ buyerId: req.user._id })
    .populate({
      path: "items.productId",
      populate: {
        path: "restaurantId",
        select: "name"
      }
    });

  if (!cart || !cart.items || cart.items.length === 0) {
    throw new APIError(400, "Cart is empty");
  }

  // Create a map from frontend restaurant groups to get deliveryBy per restaurant
  const frontendGroupsMap = new Map();
  restaurantGroups.forEach(group => {
    frontendGroupsMap.set(group.restaurantId, group.deliveryBy);
  });

  // Group cart items by restaurant on the backend for accuracy
  const restaurantGroupsMap = new Map();
  
  for (const cartItem of cart.items) {
    const product = cartItem.productId;
    if (!product || !product.restaurantId) continue;
    
    const restaurantId = product.restaurantId._id 
      ? product.restaurantId._id.toString() 
      : product.restaurantId.toString();
    
    if (!restaurantGroupsMap.has(restaurantId)) {
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) continue;
      
      // Get deliveryBy from frontend group, or determine from restaurant's hasOwnDelivery
      let deliveryBy = frontendGroupsMap.get(restaurantId);
      if (!deliveryBy) {
        // Fallback: determine from restaurant's hasOwnDelivery
        deliveryBy = restaurant.hasOwnDelivery ? "restaurant" : "platform";
      }
      
      restaurantGroupsMap.set(restaurantId, {
        restaurantId: restaurantId,
        restaurantName: restaurant.name,
        deliveryBy: deliveryBy,
        items: [],
        totalPrice: 0
      });
    }
    
    const group = restaurantGroupsMap.get(restaurantId);
    const itemPrice = product.price * cartItem.quantity;
    
    group.items.push({
      productId: product._id.toString(),
      quantity: cartItem.quantity,
      price: product.price,
      name: product.name
    });
    
    group.totalPrice += itemPrice;
  }

  // Build line items for Stripe
  const lineItems = [];
  let grandTotal = 0;
  const orderMetadata = [];

  for (const [restaurantId, group] of restaurantGroupsMap) {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      throw new APIError(404, `Restaurant ${restaurantId} not found`);
    }

    // Note: Subscription checks will be done during payment verification
    // This allows the checkout session to be created, and we'll validate
    // subscription status when actually creating orders after payment

    // Validate stock for all items
    const restaurantItems = [];
    let restaurantTotal = 0;

    for (const item of group.items) {
      const product = await Product.findById(item.productId)
        .populate("restaurantId", "name");
      
      if (!product) continue;
      
      if (product.stock === 0) {
        throw new APIError(400, `${product.name} is not available`);
      }

      if (item.quantity > product.stock) {
        throw new APIError(400, `Only ${product.stock} ${product.name} available`);
      }

      restaurantTotal += item.price * item.quantity;
      restaurantItems.push({
        productId: product._id.toString(),
        quantity: item.quantity,
        price: product.price,
        name: product.name
      });
    }

    if (restaurantItems.length === 0) {
      continue; // Skip restaurants with no valid items
    }

    // Calculate delivery fee (only for platform delivery)
    const deliveryFee = group.deliveryBy === "platform" ? PLATFORM_DELIVERY_FEE : 0;
    const restaurantTotalWithDelivery = restaurantTotal + deliveryFee;

    // Add food items to line items
    lineItems.push({
      price_data: {
        currency: "pkr",
        product_data: {
          name: `Order from ${restaurant.name}`,
          description: `${restaurantItems.length} item(s)`,
        },
        unit_amount: restaurantTotal * 100, // Convert to paise
      },
      quantity: 1,
    });

    // Add delivery fee as separate line item if platform delivery
    if (deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: "pkr",
          product_data: {
            name: `Platform Delivery Fee - ${restaurant.name}`,
            description: "Delivery service charge",
          },
          unit_amount: deliveryFee * 100, // Convert to paise
        },
        quantity: 1,
      });
    }

    grandTotal += restaurantTotalWithDelivery;
    // Store minimal data in metadata to avoid exceeding Stripe's 500 char limit
    // Full order data will be reconstructed from cart during verification
    orderMetadata.push({
      restaurantId: group.restaurantId,
      deliveryBy: group.deliveryBy, // Only essential: delivery method
      // Note: items, prices will be reconstructed from cart during verification
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/checkout?canceled=true`,
      client_reference_id: req.user._id.toString(),
      metadata: {
        userId: req.user._id.toString(),
        orderData: JSON.stringify(orderMetadata) // deliveryBy is now included in each restaurant's order data
      },
    });

    return res.status(200).json(
      new ApiResponse(200, {
        sessionId: session.id,
        url: session.url,
        totalAmount: grandTotal
      }, "Checkout session created successfully")
    );
  } catch (error) {
    throw new APIError(500, `Stripe error: ${error.message}`);
  }
});

// ✅ Verify Order Payment and Create Orders
const verifyOrderPayment = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    throw new APIError(400, "Session ID is required");
  }

  if (!stripe) {
    throw new APIError(500, "Stripe is not configured. Please contact support.");
  }

  try {
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent']
    });

    // Verify payment status
    if (session.payment_status !== "paid") {
      throw new APIError(400, `Payment not completed. Status: ${session.payment_status}`);
    }

    if (session.status !== "complete") {
      throw new APIError(400, `Checkout session not completed. Status: ${session.status}`);
    }

    // Verify payment intent if available
    if (session.payment_intent) {
      const paymentIntent = typeof session.payment_intent === 'string' 
        ? await stripe.paymentIntents.retrieve(session.payment_intent)
        : session.payment_intent;
      
      if (paymentIntent.status !== "succeeded") {
        throw new APIError(400, `Payment intent not succeeded. Status: ${paymentIntent.status}`);
      }
    }

    // Parse order data from metadata
    const orderData = JSON.parse(session.metadata.orderData || "[]");

    if (!orderData || orderData.length === 0) {
      throw new APIError(400, "No order data found in session");
    }

    // Verify the user matches
    if (session.metadata.userId !== req.user._id.toString()) {
      throw new APIError(403, "Unauthorized access");
    }

    // Get cart with populated product and restaurant data
    const cart = await Cart.findOne({ buyerId: req.user._id })
      .populate({
        path: "items.productId",
        populate: {
          path: "restaurantId",
          select: "name hasOwnDelivery"
        }
      });
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new APIError(404, "Cart not found or cart is empty");
    }

    const createdOrders = [];
    const errors = [];

    // Reconstruct order data from cart for each restaurant
    for (const orderInfo of orderData) {
      try {
        const restaurant = await Restaurant.findById(orderInfo.restaurantId);
        if (!restaurant) {
          errors.push({ restaurant: "Unknown Restaurant", error: "Restaurant not found" });
          continue;
        }

        // Reconstruct items and calculate totals from cart
        const restaurantItems = [];
        let restaurantTotal = 0;

        for (const cartItem of cart.items) {
          // Handle both populated and non-populated productId
          let product;
          if (cartItem.productId && typeof cartItem.productId === 'object') {
            product = cartItem.productId;
          } else {
            // If not populated, fetch from database
            product = await Product.findById(cartItem.productId)
              .populate("restaurantId", "name hasOwnDelivery");
          }
          
          if (!product || !product.restaurantId) continue;
          
          const productRestaurantId = product.restaurantId._id 
            ? product.restaurantId._id.toString() 
            : product.restaurantId.toString();
          
          if (productRestaurantId !== orderInfo.restaurantId) continue;

          // Check stock
          if (product.stock === 0) {
            errors.push({
              restaurant: restaurant.name,
              error: `${product.name} is not available`
            });
            continue;
          }

          if (cartItem.quantity > product.stock) {
            errors.push({
              restaurant: restaurant.name,
              error: `Only ${product.stock} ${product.name} available`
            });
            continue;
          }

          const itemPrice = product.price * cartItem.quantity;
          restaurantTotal += itemPrice;

          // Ensure productId is a valid ObjectId string
          const productIdStr = product._id ? product._id.toString() : product.toString();
          
          restaurantItems.push({
            productId: productIdStr,
            quantity: cartItem.quantity || 1,
            price: product.price || 0,
            name: product.name
          });
        }

        if (restaurantItems.length === 0) {
          errors.push({
            restaurant: restaurant.name,
            error: "No items found for this restaurant in cart"
          });
          continue;
        }

        // Check subscription status before creating order
        if (restaurant.subscriptionStatus === "active" && restaurant.subscriptionExpiry) {
          if (new Date() > restaurant.subscriptionExpiry) {
            restaurant.subscriptionStatus = "expired";
            restaurant.isSuspended = true;
            await restaurant.save();
          }
        }

        if (restaurant.isSuspended || restaurant.subscriptionStatus === "expired") {
          errors.push({ 
            restaurant: restaurant.name, 
            error: "Restaurant subscription has expired. Please contact support for a refund." 
          });
          continue;
        }

        if (restaurant.orderCount >= 15 && restaurant.subscriptionStatus !== "active") {
          errors.push({ 
            restaurant: restaurant.name, 
            error: "Restaurant has reached free order limit. Please contact support for a refund." 
          });
          continue;
        }

        // Check monthly order limit for unpaid top-rated restaurants
        const monthlyLimitCheck = await checkMonthlyOrderLimit(orderInfo.restaurantId);
        if (!monthlyLimitCheck.allowed) {
          errors.push({
            restaurant: restaurant.name,
            error: monthlyLimitCheck.message
          });
          continue;
        }

        // Check if restaurant has account details for payment transfer
        if (!restaurant.paymentDetails || !restaurant.paymentDetails.accountNumber) {
          errors.push({
            restaurant: restaurant.name,
            error: "Restaurant has not set up payment account details. Please contact support for a refund."
          });
          continue;
        }

        // Calculate delivery fee and payment split
        const foodAmount = restaurantTotal; // Food items only (calculated from cart)
        const deliveryFee = orderInfo.deliveryBy === "platform" ? PLATFORM_DELIVERY_FEE : 0;
        const totalPriceWithDelivery = foodAmount + deliveryFee;
        
        // Split payment:
        // - restaurantAmount: food items only (no delivery fee)
        // - platformAmount: delivery fee (only if platform delivery)
        const restaurantAmount = foodAmount;
        const platformAmount = deliveryFee;

        // Extract payment ID (handle both string and object cases)
        let paymentId = session.id; // Default to session ID
        if (session.payment_intent) {
          if (typeof session.payment_intent === 'string') {
            paymentId = session.payment_intent;
          } else if (session.payment_intent.id) {
            paymentId = session.payment_intent.id;
          }
        }

        // Check if order already exists for this payment (prevent duplicates)
        const existingOrder = await Order.findOne({
          buyerId: req.user._id,
          restaurantId: orderInfo.restaurantId,
          paymentId: paymentId,
          createdAt: { $gte: new Date(Date.now() - 60000) } // Within last minute
        });

        if (existingOrder) {
          console.log("Order already exists for this payment, skipping duplicate creation");
          createdOrders.push(existingOrder);
          continue;
        }

        // Validate restaurantItems before creating order
        if (!restaurantItems || restaurantItems.length === 0) {
          errors.push({
            restaurant: restaurant.name,
            error: "No valid items found for this restaurant"
          });
          continue;
        }

        // Ensure all productIds are valid ObjectIds
        const validItems = restaurantItems.map(item => {
          // Ensure productId is a valid ObjectId string
          let productId = item.productId;
          if (typeof productId === 'object' && productId._id) {
            productId = productId._id.toString();
          } else if (typeof productId === 'object') {
            productId = productId.toString();
          }
          
          return {
            productId: productId,
            quantity: item.quantity || 1,
            price: item.price || 0
          };
        }).filter(item => item.productId && item.quantity > 0 && item.price > 0);

        if (validItems.length === 0) {
          errors.push({
            restaurant: restaurant.name,
            error: "No valid items to create order"
          });
          continue;
        }

        // Create order with delivery method from orderInfo (per restaurant)
        const order = await Order.create({
          buyerId: req.user._id,
          restaurantId: orderInfo.restaurantId,
          items: validItems,
          totalPrice: totalPriceWithDelivery, // Total includes delivery fee
          deliveryFee: deliveryFee,
          restaurantAmount: restaurantAmount, // Amount to be paid to restaurant (food only)
          platformAmount: platformAmount, // Amount to be paid to platform (delivery fee)
          paymentMethod: "online",
          deliveryBy: orderInfo.deliveryBy || "platform", // Use delivery method from orderInfo
          paymentStatus: "paid",
          paymentId: paymentId // Use extracted payment ID string
        });

        // Increment restaurant order count and monthly order count
        restaurant.orderCount += 1;
        
        // Reset monthly count if needed (reset at the start of each month)
        const now = new Date();
        const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        // If no reset date set, or if reset date is before current month's first day, reset the counter
        if (!restaurant.monthlyOrderResetDate || new Date(restaurant.monthlyOrderResetDate) < firstDayOfCurrentMonth) {
          restaurant.monthlyOrderCount = 0;
          restaurant.monthlyOrderResetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        }
        
        // Only increment monthly count for unpaid top-rated restaurants
        if (restaurant.commissionType === "top_rated" && restaurant.sliderPaymentStatus !== "paid") {
          restaurant.monthlyOrderCount += 1;
        }
        
        await restaurant.save();

        // Track which product IDs to remove from cart (will remove all at once at the end)
        // Don't modify cart here - we'll do it once at the end to avoid version conflicts

        createdOrders.push(order);
      } catch (err) {
        console.error("Error creating order for restaurant:", orderInfo.restaurantId, err);
        const restaurant = await Restaurant.findById(orderInfo.restaurantId).catch(() => null);
        errors.push({
          restaurant: restaurant?.name || "Unknown Restaurant",
          error: err.message || "Failed to create order"
        });
      }
    }

    // Clear cart items for all successfully created orders
    // Use findOneAndUpdate with retry logic to avoid version conflicts
    if (createdOrders.length > 0) {
      try {
        // Get all product IDs from created orders to remove
        const orderProductIds = new Set();
        for (const order of createdOrders) {
          for (const orderItem of order.items) {
            const prodId = orderItem.productId?._id?.toString() || orderItem.productId?.toString();
            if (prodId) {
              orderProductIds.add(prodId);
            }
          }
        }
        
        // Use findOneAndUpdate with retry to handle version conflicts
        let retries = 3;
        while (retries > 0) {
          try {
            // Fetch fresh cart without populate to avoid version issues
            const cartDoc = await Cart.findOne({ buyerId: req.user._id }).lean();
            
            if (!cartDoc || !cartDoc.items || cartDoc.items.length === 0) {
              break; // Cart is already empty
            }
            
            // Filter out items that were in successful orders
            const filteredItems = cartDoc.items.filter((item) => {
              const productId = item.productId?.toString();
              return !orderProductIds.has(productId);
            });
            
            // Only update if items changed
            if (filteredItems.length !== cartDoc.items.length) {
              // Use findOneAndUpdate to avoid version conflicts
              await Cart.findOneAndUpdate(
                { buyerId: req.user._id },
                { items: filteredItems },
                { new: true, runValidators: false }
              );
            }
            break; // Success, exit retry loop
          } catch (versionError) {
            retries--;
            if (retries === 0) {
              throw versionError;
            }
            // Wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      } catch (cartError) {
        // Log cart clearing error but don't fail the entire operation
        console.error("Error clearing cart (non-critical):", cartError.message);
        // Cart will be cleared on next fetch or can be cleared manually
      }
    }

    if (createdOrders.length === 0) {
      // If no orders were created but payment was successful, this is a critical error
      // In production, you might want to issue a refund here
      throw new APIError(500, "Payment successful but failed to create any orders. Please contact support for a refund.");
    }

    // If some orders failed, still return success but include errors
    const message = errors.length > 0
      ? `Successfully created ${createdOrders.length} order(s). ${errors.length} restaurant(s) could not receive orders.`
      : `Successfully created ${createdOrders.length} order(s)`;

    return res.status(201).json(
      new ApiResponse(201, {
        orders: createdOrders,
        errors: errors.length > 0 ? errors : undefined,
        warning: errors.length > 0 ? "Some restaurants could not receive orders. Please contact support." : undefined
      }, message)
    );
  } catch (error) {
    console.error("Payment verification error:", error);
    if (error instanceof APIError) {
      throw error;
    }
    // Log full error details for debugging
    console.error("Full error stack:", error.stack);
    throw new APIError(500, `Payment verification failed: ${error.message || "Unknown error"}`);
  }
});

export {
  createOrder,
  getRestaurantOrders,
  getUserOrders,
  updateOrderStatus,
  createOrderCheckoutSession,
  verifyOrderPayment,
};

