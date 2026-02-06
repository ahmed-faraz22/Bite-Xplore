import Restaurant from "../models/Restaurant.models.js";
import { User } from "../models/user.models.js";
import APIError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import sendEmail from "../utils/sendEmail.js";

/**
 * Submit documents for verification
 * Uploads business license and owner ID, then initiates verification
 */
export const submitVerificationDocuments = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
  if (!restaurant) {
    throw new APIError(404, "Restaurant profile not found. Please create your restaurant profile first in the Dashboard.");
  }

  // Check if already verified
  if (restaurant.verificationStatus === "verified") {
    throw new APIError(400, "Restaurant is already verified");
  }

  // Early validation: ensure both files are provided
  if (!req.files || !req.files.businessLicense || !req.files.ownerId) {
    throw new APIError(400, "Both business license and owner ID are required");
  }

  // Handle file uploads
  let businessLicenseUrl = restaurant.businessLicenseUrl;
  let ownerIdUrl = restaurant.ownerIdUrl;

  if (req.files) {
    if (req.files.businessLicense && req.files.businessLicense[0]) {
      const result = await uploadOnCloudinary(req.files.businessLicense[0].path, 'verification');
      if (result) businessLicenseUrl = result.secure_url;
    }

    if (req.files.ownerId && req.files.ownerId[0]) {
      const result = await uploadOnCloudinary(req.files.ownerId[0].path, 'verification');
      if (result) ownerIdUrl = result.secure_url;
    }
  }

  if (!businessLicenseUrl || !ownerIdUrl) {
    throw new APIError(400, "Both business license and owner ID are required");
  }

  // Set status to pending for manual admin review
  restaurant.verificationStatus = "pending";
  restaurant.verificationProvider = "manual";
  restaurant.verificationResponse = {
    provider: "manual",
    submittedAt: new Date(),
    note: "Pending manual admin review"
  };

  // Save verification documents and update restaurant
  restaurant.businessLicenseUrl = businessLicenseUrl;
  restaurant.ownerIdUrl = ownerIdUrl;
  await restaurant.save();

  // Send notification email
  try {
    const user = req.user;
    await sendEmail(
      user.email,
      "Verification Documents Submitted",
      `Your verification documents have been submitted successfully. Your restaurant "${restaurant.name}" is now pending manual admin review. You will be notified once the review is complete.`
    );
  } catch (emailError) {
    console.error("Failed to send notification email:", emailError);
  }

  res.status(200).json(
    new ApiResponse(200, {
      restaurant,
      message: "Verification documents uploaded and saved successfully. Your application is pending admin review."
    }, "Verification documents submitted successfully")
  );
});

/**
 * Get verification status
 */
export const getVerificationStatus = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
  if (!restaurant) {
    // Return a response indicating no restaurant exists yet, rather than an error
    return res.status(200).json(
      new ApiResponse(200, {
        verificationStatus: null,
        verificationProvider: null,
        verifiedAt: null,
        verificationRejectionReason: null,
        hasDocuments: false,
        message: "Restaurant profile not found. Please create your restaurant profile first."
      }, "No restaurant profile found")
    );
  }

  res.status(200).json(
    new ApiResponse(200, {
      verificationStatus: restaurant.verificationStatus,
      verificationProvider: restaurant.verificationProvider,
      verifiedAt: restaurant.verifiedAt,
      verificationRejectionReason: restaurant.verificationRejectionReason,
      hasDocuments: !!(restaurant.businessLicenseUrl && restaurant.ownerIdUrl)
    }, "Verification status retrieved successfully")
  );
});

/**
 * Admin: Get all restaurants pending verification
 * Includes verification documents for admin review
 */
export const getPendingVerifications = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find({
    verificationStatus: { $in: ["pending", "manual_review"] }
  })
    .populate("ownerId", "name email username")
    .select("name city address phone verificationStatus verificationProvider createdAt businessLicenseUrl ownerIdUrl")
    .sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, restaurants, "Pending verifications retrieved successfully")
  );
});

/**
 * Admin: Approve restaurant verification
 */
export const approveVerification = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;

  const restaurant = await Restaurant.findById(restaurantId).populate("ownerId", "email name");
  if (!restaurant) {
    throw new APIError(404, "Restaurant not found");
  }

  if (restaurant.verificationStatus === "verified") {
    throw new APIError(400, "Restaurant is already verified");
  }

  restaurant.verificationStatus = "verified";
  restaurant.verifiedAt = new Date();
  restaurant.verificationProvider = "manual";
  restaurant.verificationRejectionReason = null;
  await restaurant.save();

  // Send notification email
  if (restaurant.ownerId && restaurant.ownerId.email) {
    try {
      await sendEmail(
        restaurant.ownerId.email,
        "Restaurant Verification Approved",
        `Congratulations! Your restaurant "${restaurant.name}" has been verified successfully. You can now receive orders and publish your menu.`
      );
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError);
    }
  }

  res.status(200).json(
    new ApiResponse(200, restaurant, "Restaurant verification approved successfully")
  );
});

/**
 * Admin: Reject restaurant verification
 */
export const rejectVerification = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const { reason } = req.body;

  if (!reason) {
    throw new APIError(400, "Rejection reason is required");
  }

  const restaurant = await Restaurant.findById(restaurantId).populate("ownerId", "email name");
  if (!restaurant) {
    throw new APIError(404, "Restaurant not found");
  }

  if (restaurant.verificationStatus === "verified") {
    throw new APIError(400, "Cannot reject an already verified restaurant");
  }

  restaurant.verificationStatus = "rejected";
  restaurant.verificationRejectionReason = reason;
  await restaurant.save();

  // Send notification email
  if (restaurant.ownerId && restaurant.ownerId.email) {
    try {
      await sendEmail(
        restaurant.ownerId.email,
        "Restaurant Verification Rejected",
        `Your restaurant "${restaurant.name}" verification has been rejected.\n\nReason: ${reason}\n\nPlease review your documents and resubmit if needed.`
      );
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError);
    }
  }

  res.status(200).json(
    new ApiResponse(200, restaurant, "Restaurant verification rejected successfully")
  );
});

