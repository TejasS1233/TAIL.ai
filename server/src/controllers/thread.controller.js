import { Thread } from "../models/thread.model.js";
import { Topic } from "../models/topic.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const getAllThreads = asyncHandler(async (req, res) => {
  const threads = await Thread.find().sort({ createdAt: -1 });
  return res.json(new ApiResponse(200, "Threads fetched successfully", threads));
});

export const createThread = asyncHandler(async (req, res) => {
  const { title, text, parentId, tags, topic } = req.body;

  let imagePath = null
  // If file uploaded with multer
  if (req.file) {
    imagePath = req.file?.path;
  }

  let image = null;
  if (imagePath) {
    image = await uploadOnCloudinary(imagePath);
    if (!image) {
      throw new ApiError("Error uploading avatar", 500);
    }
  }
  const userName = req.user.fullname || req.user.email;
  const userId = req.user._id;
  const userRole = req.user.role;

  // Validate required fields
  if (!title || !text) {
    throw new ApiError(400, "Title and text are required.");
  }

  if (!parentId && !topic) {
    throw new ApiError(400, "Topic is required for new threads.");
  }

  // Create or update topic if provided
  if (topic) {
    await Topic.findOneAndUpdate(
      { name: topic },
      { $setOnInsert: { name: topic } },
      { upsert: true }
    );
  }

  // Process tags - handle both string and array inputs
  let processedTags = [];
  if (tags) {
    if (Array.isArray(tags)) {
      processedTags = tags.filter(tag => tag && tag.trim());
    } else if (typeof tags === 'string') {
      processedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
  }

  const newThread = await Thread.create({
    title,
    text,
    parentId: parentId || null,
    imageUrl: image?.url || undefined,
    tags: processedTags,
    topic: topic || undefined,
    userName,
    userId,
    userRole,
  });

  // Emit socket event if io is available
  const io = req.app.get("io");
  if (io) {
    io.emit("new-thread", newThread);
  }

  return res.status(201).json(new ApiResponse(201,  "Thread created successfully" ,newThread));
});

// NEW: Get a single thread with its replies
export const getThread = asyncHandler(async (req, res) => {
  const { threadId } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(threadId)) {
    throw new ApiError(400, "Invalid thread ID");
  }

  const thread = await Thread.findById(threadId);
  if (!thread) {
    throw new ApiError(404, "Thread not found");
  }

  return res.json(new ApiResponse(200, "Thread fetched successfully", thread));
});

// NEW: Get replies for a specific thread
export const getThreadReplies = asyncHandler(async (req, res) => {
  const { threadId } = req.params;
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
  
  if (!mongoose.Types.ObjectId.isValid(threadId)) {
    throw new ApiError(400, "Invalid thread ID");
  }

  // Check if parent thread exists
  const parentThread = await Thread.findById(threadId);
  if (!parentThread) {
    throw new ApiError(404, "Parent thread not found");
  }

  const skip = (page - 1) * limit;
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const replies = await Thread.find({ parentId: threadId })
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  const totalReplies = await Thread.countDocuments({ parentId: threadId });
  const totalPages = Math.ceil(totalReplies / limit);

  const responseData = {
    replies,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalReplies,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };

  return res.json(new ApiResponse(200, "Thread replies fetched successfully", responseData));
});

// NEW: Create a reply to a thread
export const createReply = asyncHandler(async (req, res) => {
  const { threadId } = req.params;
  const { text, tags } = req.body;
  
  if (!mongoose.Types.ObjectId.isValid(threadId)) {
    throw new ApiError(400, "Invalid thread ID");
  }

  // Check if parent thread exists
  const parentThread = await Thread.findById(threadId);
  if (!parentThread) {
    throw new ApiError(404, "Parent thread not found");
  }

  // Validate required fields
  if (!text) {
    throw new ApiError(400, "Reply text is required.");
  }

  let imagePath = null;
  // If file uploaded with multer
  if (req.file) {
    imagePath = req.file?.path;
  }

  let image = null;
  if (imagePath) {
    image = await uploadOnCloudinary(imagePath);
    if (!image) {
      throw new ApiError("Error uploading image", 500);
    }
  }

  const userName = req.user.fullname || req.user.email;
  const userId = req.user._id;
  const userRole = req.user.role;

  // Process tags - handle both string and array inputs
  let processedTags = [];
  if (tags) {
    if (Array.isArray(tags)) {
      processedTags = tags.filter(tag => tag && tag.trim());
    } else if (typeof tags === 'string') {
      processedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
  }

  const newReply = await Thread.create({
    title: `Reply to: ${parentThread.title}`, // Auto-generate title for replies
    text,
    parentId: threadId,
    imageUrl: image?.url || undefined,
    tags: processedTags,
    topic: parentThread.topic, // Inherit topic from parent
    userName,
    userId,
    userRole,
  });

  // Emit socket event if io is available
  const io = req.app.get("io");
  if (io) {
    io.emit("new-reply", {
      reply: newReply,
      parentThreadId: threadId
    });
  }

  return res.status(201).json(new ApiResponse(201, "Reply created successfully", newReply));
});

// NEW: Get thread with replies count
export const getThreadWithRepliesCount = asyncHandler(async (req, res) => {
  const { threadId } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(threadId)) {
    throw new ApiError(400, "Invalid thread ID");
  }

  const thread = await Thread.findById(threadId);
  if (!thread) {
    throw new ApiError(404, "Thread not found");
  }

  const repliesCount = await Thread.countDocuments({ parentId: threadId });

  const threadWithCount = {
    ...thread.toObject(),
    repliesCount
  };

  return res.json(new ApiResponse(200, "Thread with replies count fetched successfully", threadWithCount));
});

// NEW: Get all threads with their replies count (for main thread listing)
export const getAllThreadsWithRepliesCount = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, topic, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
  
  const skip = (page - 1) * limit;
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Build query - only get main threads (parentId is null)
  let query = { parentId: null };
  if (topic) {
    query.topic = topic;
  }

  const threads = await Thread.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  // Get replies count for each thread
  const threadsWithRepliesCount = await Promise.all(
    threads.map(async (thread) => {
      const repliesCount = await Thread.countDocuments({ parentId: thread._id });
      return {
        ...thread.toObject(),
        repliesCount
      };
    })
  );

  const totalThreads = await Thread.countDocuments(query);
  const totalPages = Math.ceil(totalThreads / limit);

  const responseData = {
    threads: threadsWithRepliesCount,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalThreads,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };

  return res.json(new ApiResponse(200, "Threads with replies count fetched successfully", responseData));
});

export const likeThread = asyncHandler(async (req, res) => {
  const { threadId } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(threadId)) {
    throw new ApiError(400, "Invalid thread ID");
  }

  const thread = await Thread.findById(threadId);
  if (!thread) {
    throw new ApiError(404, "Thread not found");
  }

  const userId = req.user._id;
  const isLiked = thread.likes.includes(userId);
  const isDisliked = thread.dislikes.includes(userId);

  if (isLiked) {
    // Remove like
    thread.likes.pull(userId);
  } else {
    // Add like and remove dislike if exists
    thread.likes.push(userId);
    if (isDisliked) {
      thread.dislikes.pull(userId);
    }
  }

  await thread.save();
  return res.json(new ApiResponse(200, "Thread updated successfully", thread));
});

export const dislikeThread = asyncHandler(async (req, res) => {
  const { threadId } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(threadId)) {
    throw new ApiError(400, "Invalid thread ID");
  }

  const thread = await Thread.findById(threadId);
  if (!thread) {
    throw new ApiError(404, "Thread not found");
  }

  const userId = req.user._id;
  const isLiked = thread.likes.includes(userId);
  const isDisliked = thread.dislikes.includes(userId);

  if (isDisliked) {
    // Remove dislike
    thread.dislikes.pull(userId);
  } else {
    // Add dislike and remove like if exists
    thread.dislikes.push(userId);
    if (isLiked) {
      thread.likes.pull(userId);
    }
  }

  await thread.save();
  return res.json(new ApiResponse(200, "Thread updated successfully", thread));
});

// Keep the existing toggle pin function for backward compatibility
export const pinThread = asyncHandler(async (req, res) => {
  if (!["officer", "admin"].includes(req.user.role)) {
    throw new ApiError(403, "Only officers or admins can pin/unpin threads");
  }

  const { threadId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(threadId)) {
    throw new ApiError(400, "Invalid thread ID");
  }

  const thread = await Thread.findById(threadId);
  if (!thread) {
    throw new ApiError(404, "Thread not found");
  }

  // Toggle pin
  thread.pinned = !thread.pinned;
  await thread.save();

  return res.json(
    new ApiResponse(
      200,
      `Thread ${thread.pinned ? "pinned" : "unpinned"} successfully`,
      thread
    )
  );
});

// New separate pin function
export const pinThreadOnly = asyncHandler(async (req, res) => {
  if (!["officer", "admin"].includes(req.user.role)) {
    throw new ApiError(403, "Only officers or admins can pin threads");
  }

  const { threadId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(threadId)) {
    throw new ApiError(400, "Invalid thread ID");
  }

  const thread = await Thread.findById(threadId);
  if (!thread) {
    throw new ApiError(404, "Thread not found");
  }

  if (thread.pinned) {
    throw new ApiError(400, "Thread is already pinned");
  }

  thread.pinned = true;
  await thread.save();

  return res.json(new ApiResponse(200, "Thread pinned successfully", thread));
});

// New separate unpin function
export const unpinThread = asyncHandler(async (req, res) => {
  if (!["officer", "admin"].includes(req.user.role)) {
    throw new ApiError(403, "Only officers or admins can unpin threads");
  }

  const { threadId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(threadId)) {
    throw new ApiError(400, "Invalid thread ID");
  }

  const thread = await Thread.findById(threadId);
  if (!thread) {
    throw new ApiError(404, "Thread not found");
  }

  if (!thread.pinned) {
    throw new ApiError(400, "Thread is not pinned");
  }

  thread.pinned = false;
  await thread.save();

  return res.json(new ApiResponse(200, "Thread unpinned successfully", thread));
});