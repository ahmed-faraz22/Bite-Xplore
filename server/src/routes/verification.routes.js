import express from "express";
import multer from "multer";
import fs from "fs";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
  submitVerificationDocuments,
  getVerificationStatus,
  getPendingVerifications,
  approveVerification,
  rejectVerification
} from "../controllers/verification.controller.js";

const router = express.Router();

// Multer config for document uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "./public/temp";
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
    } catch (e) {
      return cb(e);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// Seller routes
router.post(
  "/submit-documents",
  verifyJWT,
  authorizeRoles("seller"),
  upload.fields([
    { name: "businessLicense", maxCount: 1 },
    { name: "ownerId", maxCount: 1 }
  ]),
  submitVerificationDocuments
);

router.get(
  "/status",
  verifyJWT,
  authorizeRoles("seller"),
  getVerificationStatus
);

// Admin routes
router.get(
  "/pending",
  verifyJWT,
  authorizeRoles("admin"),
  getPendingVerifications
);

router.post(
  "/approve/:restaurantId",
  verifyJWT,
  authorizeRoles("admin"),
  approveVerification
);

router.post(
  "/reject/:restaurantId",
  verifyJWT,
  authorizeRoles("admin"),
  rejectVerification
);

export default router;

