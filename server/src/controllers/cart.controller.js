import Cart from "../models/Cart.models.js";
import Product from "../models/Product.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import APIError from "../utils/ApiError.js";

// ✅ Get Cart
const getCart = asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ buyerId: req.user._id })
        .populate({
            path: "items.productId",
            populate: {
                path: "restaurantId",
                select: "name logo hasOwnDelivery"
            }
        });

    if (!cart) {
        cart = { items: [] };
    }

    return res.status(200).json({
        status: 200,
        data: cart,
        message: "Cart fetched successfully",
    });
});

// ✅ Add to Cart
const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) throw new APIError(400, "Product ID and quantity required");

    let cart = await Cart.findOne({ buyerId: req.user._id });
    if (!cart) {
        cart = await Cart.create({ buyerId: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({ productId, quantity });
    }

    await cart.save();
    await cart.populate({
        path: "items.productId",
        populate: {
            path: "restaurantId",
            select: "name logo hasOwnDelivery"
        }
    });

    return res.status(200).json({
        status: 200,
        data: cart,
        message: "Item added to cart",
    });
});

// ✅ Update Cart Item Quantity
const updateCartItem = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    if (!productId || quantity < 1) throw new APIError(400, "Product ID and valid quantity required");

    const cart = await Cart.findOne({ buyerId: req.user._id });
    if (!cart) throw new APIError(404, "Cart not found");

    const item = cart.items.find(item => item.productId.toString() === productId);
    if (!item) throw new APIError(404, "Item not in cart");

    item.quantity = quantity;
    await cart.save();
    await cart.populate({
        path: "items.productId",
        populate: {
            path: "restaurantId",
            select: "name logo hasOwnDelivery"
        }
    });

    return res.status(200).json({
        status: 200,
        data: cart,
        message: "Cart item updated",
    });
});

// ✅ Delete Cart Item
const deleteCartItem = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    if (!productId) throw new APIError(400, "Product ID required");

    const cart = await Cart.findOne({ buyerId: req.user._id });
    if (!cart) throw new APIError(404, "Cart not found");

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();
    await cart.populate({
        path: "items.productId",
        populate: {
            path: "restaurantId",
            select: "name logo hasOwnDelivery"
        }
    });

    return res.status(200).json({
        status: 200,
        data: cart,
        message: "Item removed from cart",
    });
});

export { getCart, addToCart, updateCartItem, deleteCartItem };
