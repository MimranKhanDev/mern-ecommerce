import express from "express";
import { registerValidator } from "../validators/auth.validator.js";
import validate from "../middleware/validate.js";
import asyncHandler from "../utils/asyncHandler.js";
import { register } from "../controllers/auth.controller.js";

const router = express.Router();
router.post("/register", registerValidator, validate, asyncHandler(register));

export default router;
