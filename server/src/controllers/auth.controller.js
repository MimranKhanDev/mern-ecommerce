import User from "../models/User.model.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import { generateToken } from "../utils/jwt.js";

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
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return successResponse(res, 201, "User registered successfully", { user });
};
