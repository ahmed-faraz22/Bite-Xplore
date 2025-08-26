// utils/otp.js
import nodemailer from "nodemailer";
import crypto from "crypto";
import { Otp } from "../models/otp.model.js";  // ✅ import model here

// 🔑 Generate OTP (6 digits)
export const generateOtp = () => {
  return crypto.randomInt(100000, 999999); // 6-digit OTP
};

// 🔑 Send OTP via email + Save to DB
export const sendOtp = async (email) => {
  const otp = generateOtp();

  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",  // ✅ your mailtrap
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER, // move creds to .env
      pass: process.env.MAILTRAP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP for Registration",
    text: `Your OTP is ${otp}. Please enter this to complete your registration.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP sent to:", email, "->", otp);

    // ✅ Save OTP with correct field name
    const otpRecord = new Otp({
      email: email,
      otpCode: otp,   // <-- match schema
    });
    await otpRecord.save();

    return otp;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP");
  }
};
