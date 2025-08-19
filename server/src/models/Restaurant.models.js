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
    phone: String,
    hasOwnDelivery: {
        type: Boolean,
        default: false
    },
    minOrder: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model("Restaurant", restaurantSchema);
