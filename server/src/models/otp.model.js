// models/otp.model.js
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true
    },
    otpCode: {
      type: String,
      required: true
    },
  },
  { timestamps: true } // auto adds createdAt, updatedAt
);

// TTL: OTP auto-deletes after 5 minutes
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

export const Otp = mongoose.model("Otp", otpSchema);