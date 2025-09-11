import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: "http://localhost:5173", // ✅ for local dev
    credentials: true,
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRoutes from "./routes/user.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import restaurantRoutes from "./routes/restaurant.routes.js";
import productRoutes from "./routes/product.routes.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/restaurants", restaurantRoutes);
app.use("/api/v1/products", productRoutes);


export default app;
