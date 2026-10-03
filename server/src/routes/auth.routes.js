import express from "express";
import {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  changePasswordValidator,
} from "../validators/auth.validator.js";
import validate from "../middleware/validate.js";
import { protect } from "../middleware/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerValidator, validate, asyncHandler(register));
router.post("/login", loginValidator, validate, asyncHandler(login));
router.post("/logout", asyncHandler(logout));
router.get("/me", protect, asyncHandler(getMe));

router.put(
  "/update-profile",
  protect,
  updateProfileValidator,
  validate,
  asyncHandler(updateProfile),
);
router.put(
  "/change-password",
  protect,
  changePasswordValidator,
  validate,
  asyncHandler(changePassword),
);

export default router;
