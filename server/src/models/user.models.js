import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "seller", "buyer"],
        required: true
    },
    status: {
        type: String,
        enum: ["active", "blocked"],
        default: "active"
    }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
