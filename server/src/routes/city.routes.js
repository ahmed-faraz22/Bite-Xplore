import express from "express";
import { getAllCities } from "../controllers/restaurant.controller.js";

const router = express.Router();

// ✅ Public route for getting all cities
router.get("/", getAllCities);

export default router;

