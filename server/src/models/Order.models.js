import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  buyerId: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: "User", 
     required: true 
    },
  restaurantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Restaurant", 
    required: true 
},
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, 
        ref: "Product", 
        required: true 
    },
      quantity: { 
        type: Number, 
        required: true 
    },
      price: { 
        type: Number, 
        required: true 
    }
    }
  ],
  totalPrice: {
     type: Number, 
     required: true 
    },
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "delivered", "cancelled"], 
    default: "pending" 
  },
  paymentStatus: { 
    type: String, 
    enum: ["pending", "paid"], 
    default: "pending" 
  },
  deliveryBy: {
     type: String,
      enum: ["restaurant", "platform"],
       required: true 
    }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
