import Review from "../models/Review.models.js";
import Product from "../models/Product.models.js";
import APIError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ✅ Add Rating/Review
const addReview = asyncHandler(async (req, res) => {
  const { productId, rating, comment } = req.body;
  const buyerId = req.user._id;

  // Validate input
  if (!productId || !rating) {
    throw new APIError(400, "Product ID and rating are required");
  }

  if (rating < 1 || rating > 5) {
    throw new APIError(400, "Rating must be between 1 and 5");
  }

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new APIError(404, "Product not found");
  }

  // Check if user already reviewed this product
  const existingReview = await Review.findOne({ productId, buyerId });
  
  if (existingReview) {
    // Update existing review
    existingReview.rating = rating;
    if (comment !== undefined) {
      existingReview.comment = comment;
    }
    await existingReview.save();
    
    return res
      .status(200)
      .json(new ApiResponse(200, existingReview, "Review updated successfully"));
  } else {
    // Create new review
    const review = await Review.create({
      productId,
      buyerId,
      rating,
      comment: comment || "",
    });

    return res
      .status(201)
      .json(new ApiResponse(201, review, "Review added successfully"));
  }
});

// ✅ Get Reviews for a Product
const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const reviews = await Review.find({ productId })
    .populate("buyerId", "name username")
    .sort({ createdAt: -1 });

  // Calculate average rating
  const ratings = reviews.map((r) => r.rating);
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : 0;

  return res.status(200).json(
    new ApiResponse(200, {
      reviews,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews: reviews.length,
    }, "Reviews fetched successfully")
  );
});

// ✅ Get Average Rating for a Product (for product listings)
const getProductRating = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const reviews = await Review.find({ productId }).select("rating");
  
  const ratings = reviews.map((r) => r.rating);
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : 0;

  return res.status(200).json(
    new ApiResponse(200, {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
    }, "Rating fetched successfully")
  );
});

// ✅ Get User's Review for a Product
const getUserReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const buyerId = req.user._id;

  const review = await Review.findOne({ productId, buyerId });

  return res.status(200).json(
    new ApiResponse(200, review || null, "User review fetched successfully")
  );
});

export { addReview, getProductReviews, getProductRating, getUserReview };

