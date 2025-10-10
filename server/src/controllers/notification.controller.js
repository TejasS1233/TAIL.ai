import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Notification } from "../models/notification.model.js";

const createNotification = async (userId, type, message, relatedReportId = null) => {
  try {
    const newNotification = await Notification.create({
      userId,
      type,
      message,
      relatedReportId,
    });
    return newNotification;
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

const getUserNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const notifications = await Notification.find({ userId })
    .populate("relatedReportId", "title status")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, "Notifications fetched successfully", notifications));
});

const getUnreadNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const notifications = await Notification.find({ userId, read: false })
    .populate("relatedReportId", "title status")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, "Unread notifications fetched successfully", notifications));
});

const markNotificationsAsRead = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { notificationIds } = req.body;
  let updateResult;

  if (notificationIds && notificationIds.length > 0) {
    updateResult = await Notification.updateMany(
      { _id: { $in: notificationIds }, userId },
      { $set: { read: true } }
    );
  } else {
    updateResult = await Notification.updateMany(
      { userId, read: false },
      { $set: { read: true } }
    );
  }

  return res.status(200).json(new ApiResponse(200, `${updateResult.modifiedCount} notifications marked as read`));
});

const deleteNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { notificationIds } = req.body;
  let deleteResult;

  if (notificationIds && notificationIds.length > 0) {
    deleteResult = await Notification.deleteMany({ _id: { $in: notificationIds }, userId });
  } else {
    deleteResult = await Notification.deleteMany({ userId, read: true });
  }

  return res.status(200).json(new ApiResponse(200, `${deleteResult.deletedCount} notifications deleted successfully`));
});

export {
  createNotification,
  getUserNotifications,
  getUnreadNotifications,
  markNotificationsAsRead,
  deleteNotifications,
};