// models/user.models.js
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
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
    phone: { 
        type: String 
    }, 
    // ✅ added to match frontend
    password: {
         type: String, 
         required: true 
        },
    role: {
      type: String,
      enum: ["admin", "seller", "buyer"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

// 🔑 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔑 Compare password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// 🔑 JWT tokens
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { id: this._id, username: this.username, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const User = mongoose.model("User", userSchema);
