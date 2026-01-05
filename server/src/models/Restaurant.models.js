import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    address: String,
    city: {
        type: String,
        required: true
    },
    phone: String,
    logo: String,
    hasOwnDelivery: {
        type: Boolean,
        default: false
    },
    minOrder: {
        type: Number,
        default: 0
    },
    openingTime: {
        type: String,
        default: "09:00"
    },
    closingTime: {
        type: String,
        default: "22:00"
    },
    // Subscription fields
    orderCount: {
        type: Number,
        default: 0
    },
    subscriptionStatus: {
        type: String,
        enum: ["free", "active", "expired", "suspended"],
        default: "free"
    },
    subscriptionExpiry: {
        type: Date,
        default: null
    },
    isSuspended: {
        type: Boolean,
        default: false
    },
    lastPaymentDate: {
        type: Date,
        default: null
    }
}, { timestamps: true });

export default mongoose.model("Restaurant", restaurantSchema);
