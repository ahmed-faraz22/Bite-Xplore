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
    }
}, { timestamps: true });

export default mongoose.model("Restaurant", restaurantSchema);
