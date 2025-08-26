import { User } from "../models/user.models.js";
import APIError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Otp } from "../models/otp.model.js";
import { sendOtp } from "../utils/otp.js";

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

// ✅ Send OTP
const sendOtpController = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) throw new APIError(400, "Email is required");

    await sendOtp(email); // sends + saves OTP
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "OTP sent successfully"));
});

// ✅ Verify OTP
const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
        throw new APIError(400, "Email and OTP code are required");
    }

    // Find OTP by email + latest created
    const otp = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (!otp) {
        throw new APIError(400, "OTP not generated or expired");
    }

    // Check if OTP matches
    if (otp.otpCode !== otpCode) {
        throw new APIError(400, "Invalid OTP");
    }

    // Mark user as verified
    const user = await User.findOne({ email });
    if (!user) {
        throw new APIError(404, "User not found");
    }
    user.isVerified = true;
    await user.save();

    // Delete OTPs for this email
    await Otp.deleteMany({ email });

    res.status(200).json({
        message: "OTP verified successfully",
        user
    });
});



// ✅ Register new user
const register = asyncHandler(async (req, res) => {
    const { name, username, email, phone, password, role, otp } = req.body;

    // 1. Validate required fields
    if (!name || !username || !email || !password || !role || !otp) {
        throw new APIError(400, "All fields are required, including OTP");
    }

    // 2. Check OTP
    const otpRecord = await Otp.findOne({ email, otpCode: otp });
    if (!otpRecord) throw new APIError(400, "Invalid or expired OTP");

    // ✅ OTP auto-expires via TTL index, no need for manual expiresAt check
    await Otp.deleteMany({ email }); // cleanup OTPs for that email

    // 3. Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) throw new APIError(400, "User already exists");

    // 4. Create new user
    const user = await User.create({ name, username, email, phone, password, role });

    // 5. Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    // ✅ Dev-friendly cookies (secure only in prod)
    const isProd = process.env.NODE_ENV === "production";
    const options = {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "None" : "Lax",
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

    const isProd = process.env.NODE_ENV === "production";
    const options = {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "None" : "Lax",
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user, accessToken, refreshToken }, "Login successful"));
});

// ✅ Refresh token
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

        const isProd = process.env.NODE_ENV === "production";
        const options = {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "None" : "Lax",
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

    const isProd = process.env.NODE_ENV === "production";
    const options = {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "None" : "Lax",
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Logged out successfully"));
});

export { register, sendOtpController, verifyOtp, login, refreshAccessToken, logout };
