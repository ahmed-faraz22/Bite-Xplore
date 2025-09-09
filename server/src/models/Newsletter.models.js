import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    userSubject: {
        type: String,
        required: true
    },
    userMessage: {
        type: String,
        required: true
    },
    createdAt: { type: Date, default: Date.now },
});

export const Newsletter = mongoose.model("Newsletter", newsletterSchema);