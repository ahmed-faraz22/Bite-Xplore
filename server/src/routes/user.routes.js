import express from "express";
import { sendOtpController, register, login, refreshAccessToken, logout, addNewsletter, getNewsletters, deleteNewsletter, clearNewsletters, getUserProfile, updateUserProfile } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/send-otp", sendOtpController);
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", verifyJWT, logout);
router.post("/addNewsletter", addNewsletter);
router.get("/getNewsletters", getNewsletters);
router.delete("/deleteNewsletter/:id", deleteNewsletter);
router.delete("/clearNewsletters", clearNewsletters);
router.get('/profile', verifyJWT, getUserProfile);
router.put('/profile', verifyJWT, updateUserProfile);
export default router;
