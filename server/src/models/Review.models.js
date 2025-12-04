import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: String,
    reply: String
}, { timestamps: true });

// Ensure one review per user per product
reviewSchema.index({ productId: 1, buyerId: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
