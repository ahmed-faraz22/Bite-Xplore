import Order from "../models/Order.models.js";
import Restaurant from "../models/Restaurant.models.js";
import Cart from "../models/Cart.models.js";
import Product from "../models/Product.models.js";
import APIError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ✅ Create Order from Cart
const createOrder = asyncHandler(async (req, res) => {
  const { restaurantId, paymentMethod, deliveryBy } = req.body;

  if (!restaurantId || !paymentMethod || !deliveryBy) {
    throw new APIError(400, "Restaurant ID, payment method, and delivery method are required");
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

  // Check if restaurant has exceeded free orders
  if (restaurant.orderCount >= 15 && restaurant.subscriptionStatus !== "active") {
    throw new APIError(403, "You have reached the free order limit (15 orders). Please subscribe to continue receiving orders.");
  }

  // Get cart items
  const cart = await Cart.findOne({ buyerId: req.user._id }).populate("items.productId");
  if (!cart || !cart.items || cart.items.length === 0) {
    throw new APIError(400, "Cart is empty");
  }

  // Filter items for this restaurant and validate
  const restaurantItems = [];
  let totalPrice = 0;

  for (const item of cart.items) {
    const product = await Product.findById(item.productId._id || item.productId);
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

  // Create order
  const order = await Order.create({
    buyerId: req.user._id,
    restaurantId,
    items: restaurantItems,
    totalPrice,
    paymentMethod,
    deliveryBy,
    paymentStatus: paymentMethod === "online" ? "paid" : "pending",
  });

  // Increment restaurant order count
  restaurant.orderCount += 1;
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
  }
  await order.save();

  return res.status(200).json(
    new ApiResponse(200, order, "Order status updated successfully")
  );
});

export {
  createOrder,
  getRestaurantOrders,
  getUserOrders,
  updateOrderStatus,
};

