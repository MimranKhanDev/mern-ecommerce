import User from "../models/User.model.js";
import { verifyToken } from "../utils/jwt.js";
import asyncHandler from "../utils/asyncHandler.js";
import { errorResponse } from "../utils/apiResponse.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.cookies?.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return errorResponse(res, 401, "Not authorized, no token");
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    return errorResponse(res, 401, "Not authorized, token failed");
  }
  const user = await User.findById(decoded.id);
  if (!user) {
    return errorResponse(res, 401, "User no longer exists");
  }
  req.user = user;
  next();
});
