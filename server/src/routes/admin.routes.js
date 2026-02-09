import express from "express";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { getDashboardStats } from "../controllers/admin.controller.js";

const router = express.Router();

router.get(
  "/stats",
  verifyJWT,
  authorizeRoles("admin"),
  getDashboardStats
);

export default router;
