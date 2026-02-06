import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
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
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
    },
    // Delivery fee (only charged for platform delivery)
    deliveryFee: {
      type: Number,
      default: 0,
    },

    // Order and payment statuses
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "on_the_way", "delivered", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["online"],
      required: true,
      default: "online",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentId: {
      type: String, // store payment gateway transaction id (if online)
      default: null,
    },
    // Split payment tracking
    restaurantAmount: {
      type: Number, // Amount to be paid to this restaurant (food items only, no delivery fee)
      default: null,
    },
    platformAmount: {
      type: Number, // Amount to be paid to platform (delivery fees)
      default: 0,
    },
    paymentTransferred: {
      type: Boolean, // Whether payment has been transferred to restaurant
      default: false,
    },
    transferredAt: {
      type: Date,
      default: null,
    },

    // Delivery info
    deliveryBy: {
      type: String,
      enum: ["restaurant", "platform"],
      required: true,
    },
    deliveryStatus: {
      type: String,
      enum: ["not_assigned", "assigned", "in_transit", "delivered"],
      default: "not_assigned",
    },

    // Confirmation details (for restaurant verification)
    restaurantConfirmation: {
      type: Boolean,
      default: false,
    },
    confirmedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
