import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.headers["authorization"]?.replace("Bearer", "").trim();

    if (!token) {
      throw new ApiError("Access token is missing or invalid", 401);
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      throw new ApiError("User not found for the provided access token", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(error.message || "Access token is invalid or expired", 401);
  }
});
