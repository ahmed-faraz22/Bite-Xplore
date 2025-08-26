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
app.use("/api/v1/users", userRoutes);

export default app;
