import express from "express";
import { sendOtpController, register, login, refreshAccessToken, logout } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/send-otp", sendOtpController);
router.post("/register", register);
// router.post("/verify-otp", verifyOtp); // ❌ removed
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", verifyJWT, logout);

export default router;
