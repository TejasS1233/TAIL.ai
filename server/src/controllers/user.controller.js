import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { Report } from "../models/report.model.js";
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    const accessToken = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError("Something went wrong", 500);
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, password, phone, address } = req.body;

  if (!fullname || !email || !password) {
    throw new ApiError("Please fill all required fields: fullname, email, and password.", 400);
  }

  const filters = [];
  if (email) filters.push({ email: email.toLowerCase() });
  if (phone) filters.push({ phone });

  const existingUser = await User.findOne({
    $or: filters,
  });

  if (existingUser) {
    throw new ApiError("User with this email or phone number already exists", 409);
  }

  let avatarLocalPath;
  if (req.file) {
    avatarLocalPath = req.file?.path;
  }

  let avatar = null;
  if (avatarLocalPath) {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
      throw new ApiError("Error uploading avatar", 500);
    }
  }

  const userData = {
    fullname,
    email: email.toLowerCase(),
    password,
    phone,
    address,
    avatar: avatar?.url,
    role: "citizen",
    citizenProfile: {},
  };

  const createdUser = await User.create(userData);
  if (!createdUser) {
    throw new ApiError("User creation failed", 500);
  }

  const user = await User.findById(createdUser._id).select("-password -refreshToken");
  return res.status(201).json(new ApiResponse(201, "User registered successfully", user));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, phone, password } = req.body;
  if (!email && !phone) {
    throw new ApiError("Please provide either email or phone number", 400);
  }

  const filters = [];
  if (email) filters.push({ email: email.toLowerCase() });
  if (phone) filters.push({ phone });

  const user = await User.findOne({ $or: filters });
  if (!user) {
    throw new ApiError("User not found", 404);
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError("Incorrect password", 401);
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "User logged in successfully", {
        user: loggedInUser,
        accessToken,
        refreshToken,
      })
    );
});

// Google OAuth Login: accepts { idToken } from client
const googleOAuthLogin = asyncHandler(async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    throw new ApiError("Google ID token is required", 400);
  }

  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  let ticket;
  try {
    ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
  } catch (err) {
    throw new ApiError("Invalid Google ID token", 401);
  }

  const payload = ticket.getPayload();
  const googleUserId = payload.sub;
  const email = (payload.email || "").toLowerCase();
  const fullname = payload.name || email?.split("@")[0] || "User";
  const avatar = payload.picture;

  if (!email) {
    throw new ApiError("Google account does not have a verified email", 400);
  }

  // Try find by googleId first, then fallback to email (link accounts)
  let user = await User.findOne({ $or: [{ googleId: googleUserId }, { email }] });

  if (!user) {
    user = await User.create({
      fullname,
      email,
      password: undefined,
      avatar,
      role: "citizen",
      citizenProfile: {},
      authProvider: "google",
      googleId: googleUserId,
    });
  } else {
    // Ensure google link and provider set
    const update = {};
    if (!user.googleId) update.googleId = googleUserId;
    if (user.authProvider !== "google") update.authProvider = "google";
    if (avatar && !user.avatar) update.avatar = avatar;
    if (Object.keys(update).length > 0) {
      await User.updateOne({ _id: user._id }, { $set: update });
      user = await User.findById(user._id);
    }
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "User logged in with Google successfully", {
        user: loggedInUser,
        accessToken,
        refreshToken,
      })
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $set: { refreshToken: undefined } }, { new: true });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .status(200)
    .json(new ApiResponse(200, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incRefreshToken) {
    throw new ApiError("Please provide a refresh token", 401);
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(incRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError("Invalid refresh token", 401);
  }

  const user = await User.findById(decodedToken?._id);
  if (!user) {
    throw new ApiError("User not found", 404);
  }

  if (user.refreshToken !== incRefreshToken) {
    throw new ApiError("Refresh token has been tampered with or is invalid", 401);
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "Access token refreshed successfully", {
        accessToken,
        refreshToken,
      })
    );
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new ApiError("Please provide both old and new passwords", 400);
  }

  const user = await User.findById(req.user._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError("Incorrect old password", 401);
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: true });

  return res.status(200).json(new ApiResponse(200, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -refreshToken");
  return res.status(200).json(new ApiResponse(200, "Current user fetched successfully", user));
});

const updateCurrentUser = asyncHandler(async (req, res) => {
  const { fullname, email, phone, address } = req.body;
  if (!fullname && !email && !phone && !address) {
    throw new ApiError("Please provide at least one field to update", 400);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { fullname, email, phone, address } },
    { new: true }
  ).select("-password -refreshToken");

  return res.status(200).json(new ApiResponse(200, "User updated successfully", updatedUser));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError("Avatar file is missing", 400);
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar.url) {
    throw new ApiError("Error while uploading avatar", 500);
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar: avatar.url } },
    { new: true }
  ).select("-password");

  return res.status(200).json(new ApiResponse(200, "Avatar updated successfully", user));
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError("User ID parameter is required", 400);
  }

  const user = await User.findById(id).select("-password -refreshToken");
  if (!user) {
    throw new ApiError("User not found", 404);
  }

  return res.status(200).json(new ApiResponse(200, "User profile fetched successfully", user));
});

const saveFCMToken = asyncHandler(async (req, res) => {
  const { fcmToken } = req.body;

  if (!fcmToken) {
    throw new ApiError("FCM token is required", 400);
  }

  await User.findByIdAndUpdate(req.user._id, { $set: { FCMToken: fcmToken } }, { new: true });

  return res.status(200).json(new ApiResponse(200, "FCM token saved successfully"));
});

const updateWorkerLocation = asyncHandler(async (req, res) => {
  if (req.user.role !== "worker") {
    throw new ApiError("Only workers can update location", 403);
  }

  const { coordinates } = req.body;
  if (!coordinates || coordinates.length !== 2) {
    throw new ApiError("Coordinates [lng, lat] are required", 400);
  }

  const updatedWorker = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { "municipalWorkerProfile.location": { type: "Point", coordinates } } },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Worker location updated successfully", updatedWorker));
});

const getUsers = asyncHandler(async (req, res) => {
  const { role, busy, department, status, isActive } = req.query;
  const filter = {};

  if (role) {
    filter.role = role;
  }

  if (busy !== undefined) {
    if (busy === "true" || busy === "True" || busy === "1") {
      filter["municipalWorkerProfile.busy"] = true;
    } else if (busy === "false" || busy === "False" || busy === "0") {
      filter["municipalWorkerProfile.busy"] = false;
    }
  }

  if (department) {
    filter["municipalWorkerProfile.department"] = department;
  }

  if (status) {
    filter.status = status;
  }

  if (isActive !== undefined) {
    if (isActive === "true" || isActive === "True" || isActive === "1") {
      filter.isActive = true;
    } else if (isActive === "false" || isActive === "False" || isActive === "0") {
      filter.isActive = false;
    }
  }

  const users = await User.find(filter).select("-password -refreshToken");

  if (!users || users.length === 0) {
    return res.status(404).json(new ApiResponse(404, "No workers found in department", { users }));
  }

  return res.status(200).json(new ApiResponse(200, "Users fetched successfully", { users }));
});

const getNearbyWorkers = asyncHandler(async (req, res) => {
  const { id } = req.params; // Report ID
  const { radius = 5, limit = 10 } = req.query; // radius in km

  // 1. Get the report
  const report = await Report.findById(id);
  if (!report) throw new ApiError("Report not found", 404);

  const [longitude, latitude] = report.location.coordinates;
  const radiusInMeters = parseFloat(radius) * 1000;

  // 2. Find nearby workers (role = worker)
  const workers = await User.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: [longitude, latitude] },
        distanceField: "distance",
        spherical: true,
        maxDistance: radiusInMeters,
        query: { role: "worker" },
      },
    },
    { $limit: parseInt(limit) },
    {
      $project: {
        fullname: 1,
        email: 1,
        "municipalWorkerProfile.department": 1,
        "municipalWorkerProfile.busy": 1,
        "municipalWorkerProfile.location": 1,
        distance: 1,
      },
    },
  ]);

  // 3. Response
  return res.status(200).json(
    new ApiResponse(200, `Found ${workers.length} nearby workers`, {
      report: {
        id: report._id,
        title: report.title,
        coordinates: report.location.coordinates,
      },
      workers,
    })
  );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateCurrentUser,
  updateUserAvatar,
  getUserProfile,
  saveFCMToken,
  updateWorkerLocation,
  getUsers,
  getNearbyWorkers,
  googleOAuthLogin,
};
