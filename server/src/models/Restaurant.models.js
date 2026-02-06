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
    },
    // Payment details for receiving payments
    paymentDetails: {
        accountHolderName: {
            type: String,
            default: null
        },
        accountNumber: {
            type: String,
            default: null
        },
        bankName: {
            type: String,
            default: null
        },
        iban: {
            type: String,
            default: null
        },
        paymentMethod: {
            type: String,
            enum: ["bank_transfer", "easypaisa", "jazzcash", "other"],
            default: null
        }
    },
    // Verification fields
    verificationStatus: {
        type: String,
        enum: ["pending", "verified", "manual_review", "rejected"],
        default: "pending"
    },
    verificationProvider: {
        type: String,
        enum: ["manual"],
        default: "manual"
    },
    verificationResponse: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    verifiedAt: {
        type: Date,
        default: null
    },
    verificationRejectionReason: {
        type: String,
        default: null
    },
    // Documents for verification
    businessLicenseUrl: {
        type: String,
        default: null
    },
    ownerIdUrl: {
        type: String,
        default: null
    },
    // Rating and Commission fields
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    isTopRated: {
        type: Boolean,
        default: false
    },
    // Slider and Commission fields
    sliderStatus: {
        type: String,
        enum: ["in_slider", "not_in_slider", "pending"],
        default: "not_in_slider"
    },
    commissionType: {
        type: String,
        enum: ["slider", "top_rated", "none"],
        default: "none"
    },
    commissionAmount: {
        type: Number,
        default: 0
    },
    sliderPaymentStatus: {
        type: String,
        enum: ["paid", "unpaid", "expired"],
        default: "unpaid"
    },
    sliderPaymentExpiry: {
        type: Date,
        default: null
    },
    sliderPaymentDate: {
        type: Date,
        default: null
    },
    // Monthly order tracking for commission limits
    monthlyOrderCount: {
        type: Number,
        default: 0
    },
    monthlyOrderResetDate: {
        type: Date,
        default: null
    },
    // Payment tracking fields
    totalEarnings: {
        type: Number,
        default: 0,
        min: 0
    },
    totalOrdersEarnings: {
        type: Number,
        default: 0,
        min: 0
    },
    lastEarningDate: {
        type: Date,
        default: null
    }
}, { timestamps: true });

export default mongoose.model("Restaurant", restaurantSchema);
