import User from "../models/User.model.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import { generateToken } from "../utils/jwt.js";
import bcrypt from "bcryptjs";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
const DUMMY_HASH =
  "$2b$10$95Va97PK7f0wbkwg9LlvAuhcS2vPfgPcBsLKPhnwegE5BctWgcKAC";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    return errorResponse(res, 409, "A user with this email already exists", [
      { field: "email", message: "This email is already registered" },
    ]);
  }
  const user = await User.create({ name, email, password });
  user.password = undefined;
  const token = generateToken({ id: user._id, role: user.role });
  res.cookie("token", token, COOKIE_OPTIONS);
  return successResponse(res, 201, "User registered successfully", { user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  const hash = user ? user.password : DUMMY_HASH;
  const match = await bcrypt.compare(password, hash);
  if (!user || !match) {
    return errorResponse(res, 401, "Invalid email or password");
  }
  user.lastLogin = new Date();
  await user.save();
  const token = generateToken({ id: user._id, role: user.role });
  res.cookie("token", token, COOKIE_OPTIONS);
  user.password = undefined;
  return successResponse(res, 200, "Login successful", { user });
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return successResponse(res, 200, "Logged out successfully", null);
};

export const getMe = async (req, res) => {
  return successResponse(res, 200, "User fetched", { user: req.user });
};

export const updateProfile = async (req, res) => {
  const user = req.user;
  const { phone, name } = req.body;
  if (name !== undefined) {
    user.name = name;
  }
  if (phone !== undefined) {
    user.phone = phone;
  }
  await user.save();
  // Defensive: req.user never had a password (select: false), but strip anyway.
  user.password = undefined;
  return successResponse(res, 200, "User data updated", { user });
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return errorResponse(res, 401, "Current password is incorrect");
  }
  user.password = newPassword;
  await user.save();
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return successResponse(res, 200, "Password changed successfully", null);
};
