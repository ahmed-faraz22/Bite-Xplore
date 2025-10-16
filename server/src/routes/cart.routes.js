import express from "express";
import { getCart, addToCart, updateCartItem, deleteCartItem } from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT); // all cart routes require login

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/delete/:productId", deleteCartItem);

export default router;
