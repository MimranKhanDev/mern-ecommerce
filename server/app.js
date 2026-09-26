import "dotenv/config";
import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";
import authRouter from "./src/routes/auth.routes.js";

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use("/api/v1/auth", authRouter);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});
export default app;
