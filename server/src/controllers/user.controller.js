import { User } from "../models/user.models.js";
import APIError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ✅ Generate tokens
const generateAccessAndRefreshToken = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new APIError(404, "User not found");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};

// ✅ Register new user
const register = asyncHandler(async (req, res) => {
    const { name, username, email, password, role } = req.body;

    if (!name || !username || !email || !password || !role) {
        throw new APIError(400, "All fields are required");
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) throw new APIError(400, "User already exists");

    const user = await User.create({ name, username, email, password, role });

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    };

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(201, { user, accessToken, refreshToken }, "User registered successfully"));
});

// ✅ Login
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) throw new APIError(400, "Email and password are required");

    const user = await User.findOne({ email });
    if (!user) throw new APIError(404, "User not found");

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) throw new APIError(401, "Invalid credentials");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user, accessToken, refreshToken }, "Login successful"));
});

// ✅ Refresh token
import jwt from "jsonwebtoken";
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) throw new APIError(401, "Unauthorized request");

    try {
        const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== incomingRefreshToken) {
            throw new APIError(401, "Invalid or expired refresh token");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken }, "Token refreshed"));
    } catch (err) {
        throw new APIError(401, "Invalid refresh token");
    }
});

// ✅ Logout
const logout = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) throw new APIError(404, "User not found");

    user.refreshToken = null;
    await user.save();

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Logged out successfully"));
});

export { register, login, refreshAccessToken, logout };
