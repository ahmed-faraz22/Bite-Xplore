// import { User } from "../models/user.models.js";
// import APIError from "../utils/ApiError.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import jwt from "jsonwebtoken"

// export const verifyJWT = asyncHandler(async (req, res, next) => {
//     const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

//     if (!token) {
//         throw new APIError(401, "Unauthorized request");
//     }

//     try {
//         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//         // ✅ Corrected
//         const user = await User.findById(decodedToken?.id).select("-password -refreshToken");

//         if (!user) {
//             throw new APIError(401, "Invalid access token");
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         throw new APIError(401, error?.message || "Invalid Access Token");
//     }
// });


import { User } from "../models/user.models.js";
import APIError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new APIError(401, "Unauthorized request, no token provided");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?.id).select("-password -refreshToken");
    if (!user) {
      throw new APIError(401, "Invalid access token, user not found");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new APIError(401, "Unauthorized or expired token");
  }
});

// ✅ Role-based access
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new APIError(403, "You are not allowed to access this resource");
    }
    next();
  };
};
