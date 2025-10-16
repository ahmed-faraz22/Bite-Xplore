// models/Cart.models.js
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true, // each user has only one cart
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
                min: 1,
            },
        },
    ],
}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);
  