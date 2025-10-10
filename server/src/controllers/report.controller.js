import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Report } from "../models/report.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { sendPushNotification } from "../services/notification.service.js";
import axios from "axios";

const createReport = asyncHandler(async (req, res) => {
  const citizenId = req.user?._id;
  const {
    title,
    description,
    coordinates,
    category,
    customCategory,
    priority = "low",
    images = [],
  } = req.body;

  if (!title || !coordinates || !category) {
    throw new ApiError("title, coordinates, and category are required", 400);
  }

  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    throw new ApiError("coordinates must be [longitude, latitude]", 400);
  }

  const [longitude, latitude] = coordinates;
  if (
    isNaN(longitude) ||
    isNaN(latitude) ||
    longitude < -180 ||
    longitude > 180 ||
    latitude < -90 ||
    latitude > 90
  ) {
    throw new ApiError("Invalid coordinates provided", 400);
  }

  let uploadedImages = images;
  if (req.files?.length > 0) {
    uploadedImages = [];
    for (const file of req.files) {
      const result = await uploadOnCloudinary(file.path);
      if (result?.url) uploadedImages.push(result.url);
    }
  }

  // Initialize defaults for when AI service is unavailable
  let aiResponse = null;
  let finalCategory = category;
  let finalPriority = priority;
  let finalCustomCategory = customCategory;
  let finalDepartment = null;
  let historyEntries = [];
  let aiServiceAvailable = false;

  // Attempt AI processing with graceful degradation
  try {
    const response = await axios.post(
      "http://localhost:5000/process_report",
      {
        citizenId,
        title,
        description,
        images: uploadedImages,
        location: { type: "Point", coordinates: [longitude, latitude] },
        category,
        customCategory,
        priority,
      },
      {
        timeout: 20000,
        signal: AbortSignal.timeout(20000),
      }
    );

    aiResponse = response.data;
    aiServiceAvailable = true;

    if (aiResponse) {
      console.log("[AI SERVICE] Response received:", aiResponse);
      finalCategory = aiResponse.category || finalCategory;
      finalPriority = aiResponse.priority || finalPriority;
      finalDepartment = aiResponse.department || finalDepartment;
      finalCustomCategory = aiResponse.customCategory || finalCustomCategory;
      historyEntries = aiResponse.history || [];

      if (finalDepartment === "public_safety") {
        finalCategory = "other";
        finalCustomCategory = "Public Safety";
      }

      // Handle AI rejection of spam content
      if (aiResponse.status === "rejected") {
        const reportAuthor = await User.findById(citizenId);
        if (reportAuthor && reportAuthor.citizenProfile) {
          reportAuthor.citizenProfile.communityScore = Math.max(
            0,
            reportAuthor.citizenProfile.communityScore - 5
          );
          reportAuthor.markModified("citizenProfile");
          await reportAuthor.save();
        }
        return res.status(403).json(new ApiResponse(403, "Spam content detected by AI", null));
      }
    }
  } catch (err) {
    // Graceful degradation - continue without AI processing
    console.warn("[AI SERVICE] Unavailable, continuing with manual processing:", {
      error: err.message,
      code: err.code,
      isTimeout: err.code === "ECONNABORTED" || err.name === "AbortError",
    });

    // Add fallback history entry noting AI service was unavailable
    historyEntries = [
      {
        status: "ai_processing_skipped",
        notes: "AI service unavailable - processed manually",
        timestamp: new Date(),
      },
    ];
  }

  // Continue with duplicate detection and report creation
  const extractKeywords = (text) => {
    if (!text) return [];
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter(
        (word) =>
          word.length > 2 &&
          ![
            "the",
            "and",
            "or",
            "in",
            "on",
            "at",
            "to",
            "for",
            "of",
            "with",
            "by",
            "that",
            "this",
            "are",
            "was",
            "were",
            "been",
            "have",
            "has",
            "had",
          ].includes(word)
      );
  };

  const titleKeywords = extractKeywords(title);
  const descKeywords = extractKeywords(description);
  const allKeywords = [...new Set([...titleKeywords, ...descKeywords])];

  const orConditions = [];

  if (allKeywords.length >= 2) {
    orConditions.push({
      title: {
        $regex: allKeywords.slice(0, 3).join(".*"),
        $options: "i",
      },
    });
  }

  if (allKeywords.length > 0) {
    orConditions.push({
      description: {
        $regex: allKeywords.join("|"),
        $options: "i",
      },
    });
  }

  let duplicate = null;
  if (orConditions.length > 0) {
    duplicate = await Report.findOne({
      category: finalCategory,
      status: { $nin: ["resolved", "closed"] },
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: 500,
        },
      },
      $or: orConditions,
    });
  }

  let newReport;
  let isDuplicate = false;

  // Create base history entry
  const baseHistoryEntry = {
    status: "submitted",
    updatedBy: citizenId,
    notes: aiServiceAvailable
      ? "Report submitted and processed by AI"
      : "Report submitted (AI service unavailable)",
    timestamp: new Date(),
  };

  if (duplicate) {
    isDuplicate = true;
    console.log(`[DUPLICATE DETECTED] Linking report to ${duplicate._id}`);

    newReport = await Report.create({
      citizenId,
      title,
      description,
      images: uploadedImages,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      category: finalCategory,
      customCategory: finalCustomCategory,
      priority: finalPriority,
      department: finalDepartment,
      vote: 0,
      history: [
        {
          ...baseHistoryEntry,
          notes: aiServiceAvailable
            ? "Duplicate report submitted and linked (AI processed)"
            : "Duplicate report submitted and linked (manual processing)",
        },
        ...historyEntries,
      ],
      duplicateOf: duplicate._id,
    });
  } else {
    newReport = await Report.create({
      citizenId: citizenId,
      title,
      description,
      images: uploadedImages,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      category: finalCategory,
      customCategory: finalCustomCategory,
      priority: finalPriority,
      department: finalDepartment,
      vote: 0,
      history: [baseHistoryEntry, ...historyEntries],
    });
  }

  // Send push notification
  try {
    const citizen = await User.findById(citizenId);
    if (citizen?.FCMToken) {
      const notifTitle = isDuplicate
        ? "Duplicate Report Detected!"
        : "Report Submitted Successfully!";
      const notifBody = isDuplicate
        ? `We've linked your report "${newReport.title}" to an existing issue.`
        : `Thank you! Your report "${newReport.title}" has been received.`;
      await sendPushNotification(citizen.FCMToken, notifTitle, notifBody);
    }
  } catch (error) {
    console.error("[NOTIFICATION] Push notification error:", error);
  }

  // Update citizen stats
  await User.findByIdAndUpdate(citizenId, {
    $inc: { "citizenProfile.reportsSubmitted": 1 },
  });

  // Return populated report
  const populated = await Report.findById(newReport._id)
    .populate({ path: "citizenId", select: "fullname avatar email" })
    .populate("assignee", "fullname email");

  const responseMessage = aiServiceAvailable
    ? isDuplicate
      ? "Duplicate report detected and linked"
      : "Report created successfully"
    : isDuplicate
      ? "Duplicate report detected and linked (AI service unavailable)"
      : "Report created successfully (AI service unavailable)";

  return res.status(201).json(
    new ApiResponse(201, responseMessage, {
      populated,
      aiResponse,
      aiServiceAvailable, // Include this flag for frontend awareness
    })
  );
});

const getReports = asyncHandler(async (req, res) => {
  const { status, category, priority, citizenId, assignee, page = 1, limit = 5 } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (priority) filter.priority = priority;
  if (citizenId) filter.citizenId = citizenId;
  if (assignee) filter.assignee = assignee;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const reports = await Report.find(filter)
    .populate("citizenId", "fullname email")
    .populate("assignee", "fullname email")
    .populate("assignedTo.staffId", "fullname email")
    .populate("comments.user", "fullname email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Report.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(200, "Reports fetched successfully", {
      reports,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalReports: total,
        hasNextPage: skip + reports.length < total,
        hasPrevPage: parseInt(page) > 1,
      },
    })
  );
});

const getReportById = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id)
    .populate("citizenId", "fullname email")
    .populate("assignee", "fullname email")
    .populate("assignedTo.staffId", "fullname email")
    .populate("history.updatedBy", "fullname email")
    .populate("comments.user", "fullname email")
    .populate("votes.userId", "fullname email");

  if (!report) throw new ApiError("Report not found", 404);

  return res.status(200).json(new ApiResponse(200, "Report fetched successfully", report));
});

const assignReport = asyncHandler(async (req, res) => {
  const { staffId, dueDate, notes } = req.body;

  if (!staffId) throw new ApiError("staffId is required", 400);

  const report = await Report.findById(req.params.id);
  if (!report) throw new ApiError("Report not found", 404);

  const staff = await User.findById(staffId);
  if (!staff) throw new ApiError("Staff member not found", 404);

  report.assignedTo = {
    staffId,
    assignedAt: new Date(),
    dueDate: dueDate ? new Date(dueDate) : null,
    notes: notes || "Report assigned to staff member",
  };
  report.assignee = staffId;
  report.status = "assigned";

  report.history.push({
    status: "assigned",
    updatedBy: req.user._id,
    notes: `Assigned to ${staff.fullname}${notes ? ` - ${notes}` : ""}`,
    timestamp: new Date(),
  });

  await report.save();

  const populated = await Report.findById(report._id)
    .populate("citizenId", "fullname email")
    .populate("assignee", "fullname email")
    .populate("assignedTo.staffId", "fullname email");

  return res.status(200).json(new ApiResponse(200, "Report assigned successfully", populated));
});

const updateReportStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;

  if (!status) throw new ApiError("status is required", 400);

  const validStatuses = [
    "submitted",
    "acknowledged",
    "assigned",
    "in_progress",
    "resolved",
    "rejected",
  ];
  if (!validStatuses.includes(status)) {
    throw new ApiError(`Invalid status. Must be one of: ${validStatuses.join(", ")}`, 400);
  }

  const report = await Report.findById(req.params.id);
  if (!report) throw new ApiError("Report not found", 404);

  const oldStatus = report.status;
  report.status = status;

  report.history.push({
    status,
    updatedBy: req.user._id,
    notes: notes || `Status changed from ${oldStatus} to ${status}`,
    timestamp: new Date(),
  });

  await report.save();

  if (status === "resolved" && oldStatus !== "resolved") {
    const reportAuthor = await User.findById(report.citizenId);
    if (reportAuthor && reportAuthor.citizenProfile) {
      reportAuthor.citizenProfile.reportsResolved =
        (reportAuthor.citizenProfile.reportsResolved || 0) + 1;
      reportAuthor.citizenProfile.communityScore =
        (reportAuthor.citizenProfile.communityScore || 0) + 10;
      reportAuthor.markModified("citizenProfile");
      await reportAuthor.save();
    }
  }

  const populated = await Report.findById(report._id)
    .populate("citizenId", "fullname email")
    .populate("assignee", "fullname email")
    .populate("history.updatedBy", "fullname email");

  return res
    .status(200)
    .json(new ApiResponse(200, "Report status updated successfully", populated));
});

const getReportHistory = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id)
    .populate("history.updatedBy", "fullname email")
    .select("history");

  if (!report) throw new ApiError("Report not found", 404);

  return res
    .status(200)
    .json(new ApiResponse(200, "Report history fetched successfully", report.history));
});

const getReportByLocation = asyncHandler(async (req, res) => {
  const { longitude, latitude, radius = 2, page = 1, limit = 10 } = req.query;

  if (!longitude || !latitude) {
    throw new ApiError("longitude and latitude parameters are required", 400);
  }

  const lng = parseFloat(longitude);
  const lat = parseFloat(latitude);
  const radiusInKm = parseFloat(radius);

  if (isNaN(lng) || isNaN(lat) || lng < -180 || lng > 180 || lat < -90 || lat > 90) {
    throw new ApiError("Invalid coordinates provided", 400);
  }

  const radiusInMeters = radiusInKm * 1000;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const reports = await Report.find({
    location: {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
        $maxDistance: radiusInMeters,
      },
    },
  })
    .populate("citizenId", "fullname email")
    .populate("assignee", "fullname email")
    .skip(skip)
    .limit(parseInt(limit));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        `Found ${reports.length} reports within ${radiusInKm}km of coordinates [${lng}, ${lat}]`,
        reports
      )
    );
});

const getReportByDepartment = asyncHandler(async (req, res) => {
  const { page = 1, limit = 100 } = req.query;

  const { department } = req.user.municipalOfficerProfile;

  if (!department) {
    throw new ApiError("Officer department not found", 400);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = {
    department: department,
  };

  const reports = await Report.find(filter)
    .populate("citizenId", "fullname email")
    .populate("assignee", "fullname email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Report.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(200, `All reports for department: ${department}`, {
      reports,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalReports: total,
        hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit)),
        hasPrevPage: parseInt(page) > 1,
      },
    })
  );
});

const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const userId = req.user._id;

  if (!text || !text.trim()) {
    throw new ApiError("Comment text is required", 400);
  }

  const report = await Report.findById(req.params.id);
  if (!report) throw new ApiError("Report not found", 404);

  const comment = {
    text: text.trim(),
    user: userId,
    timestamp: new Date(),
  };

  report.comments.push(comment);
  await report.save();

  const populated = await Report.findById(report._id)
    .populate("comments.user", "fullname email")
    .select("comments");

  const newComment = populated.comments[populated.comments.length - 1];

  return res
    .status(201)
    .json(new ApiResponse(201, "Comment added successfully", { comment: newComment }));
});

const getComments = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id)
    .populate("comments.user", "fullname email")
    .select("comments");

  if (!report) throw new ApiError("Report not found", 404);

  return res
    .status(200)
    .json(new ApiResponse(200, "Comments fetched successfully", report.comments));
});

const getReportsByPriority = asyncHandler(async (req, res) => {
  const { priority, page = 1, limit = 10 } = req.query;

  if (!priority) {
    throw new ApiError("priority parameter is required", 400);
  }

  const validPriorities = ["low", "medium", "high", "critical"];
  if (!validPriorities.includes(priority.toLowerCase())) {
    throw new ApiError(`Invalid priority. Must be one of: ${validPriorities.join(", ")}`, 400);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const reports = await Report.find({ priority: priority.toLowerCase() })
    .populate("citizenId", "fullname email")
    .populate("assignee", "fullname email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Report.countDocuments({ priority: priority.toLowerCase() });

  return res.status(200).json(
    new ApiResponse(200, `Reports filtered by priority: ${priority}`, {
      reports,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalReports: total,
      },
    })
  );
});

const getMyReports = asyncHandler(async (req, res) => {
  const citizenId = req.user._id;
  const { status, category, page = 1, limit = 10 } = req.query;

  const filter = { citizenId };
  if (status) filter.status = status;
  if (category) filter.category = category;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const reports = await Report.find(filter)
    .populate("assignee", "fullname email")
    .populate("comments.user", "fullname email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Report.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(200, "My reports fetched successfully", {
      reports,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalReports: total,
      },
    })
  );
});

const voteOnReport = asyncHandler(async (req, res) => {
  const { voteType } = req.body;
  const reportId = req.params.id;
  const userId = req.user._id;

  if (voteType && !["upvote", "downvote"].includes(voteType)) {
    throw new ApiError("voteType must be 'upvote', 'downvote', or null", 400);
  }

  const report = await Report.findById(reportId);
  if (!report) throw new ApiError("Report not found", 404);

  const existingVoteIndex = report.votes.findIndex(
    (vote) => vote.userId.toString() === userId.toString()
  );

  if (voteType === null) {
    if (existingVoteIndex !== -1) {
      const existingVote = report.votes[existingVoteIndex];
      if (existingVote.voteType === "upvote") {
        report.vote -= 1;
        const reportAuthor = await User.findById(report.citizenId);
        if (reportAuthor && reportAuthor.role === "citizen" && reportAuthor.citizenProfile) {
          reportAuthor.citizenProfile.communityScore = Math.max(
            0,
            reportAuthor.citizenProfile.communityScore - 1
          );
          reportAuthor.markModified("citizenProfile");
          await reportAuthor.save();
        }
      } else if (existingVote.voteType === "downvote") {
        report.vote += 1;
        const reportAuthor = await User.findById(report.citizenId);
        if (reportAuthor && reportAuthor.role === "citizen" && reportAuthor.citizenProfile) {
          reportAuthor.citizenProfile.communityScore += 1;
          reportAuthor.markModified("citizenProfile");
          await reportAuthor.save();
        }
      }
      report.votes.splice(existingVoteIndex, 1);
    }
  } else {
    if (existingVoteIndex !== -1) {
      const existingVote = report.votes[existingVoteIndex];
      if (existingVote.voteType !== voteType) {
        if (existingVote.voteType === "upvote") {
          report.vote -= 2;
          const reportAuthor = await User.findById(report.citizenId);
          if (reportAuthor && reportAuthor.role === "citizen" && reportAuthor.citizenProfile) {
            reportAuthor.citizenProfile.communityScore = Math.max(
              0,
              reportAuthor.citizenProfile.communityScore - 2
            );
            reportAuthor.markModified("citizenProfile");
            await reportAuthor.save();
          }
        } else {
          report.vote += 2;
          const reportAuthor = await User.findById(report.citizenId);
          if (reportAuthor && reportAuthor.role === "citizen" && reportAuthor.citizenProfile) {
            reportAuthor.citizenProfile.communityScore += 2;
            reportAuthor.markModified("citizenProfile");
            await reportAuthor.save();
          }
        }
        report.votes[existingVoteIndex].voteType = voteType;
        report.votes[existingVoteIndex].timestamp = new Date();
      }
    } else {
      if (voteType === "upvote") {
        report.vote += 1;
        const reportAuthor = await User.findById(report.citizenId);
        if (reportAuthor && reportAuthor.role === "citizen" && reportAuthor.citizenProfile) {
          reportAuthor.citizenProfile.communityScore += 1;
          reportAuthor.markModified("citizenProfile");
          await reportAuthor.save();
        }
      } else if (voteType === "downvote") {
        report.vote -= 1;
        const reportAuthor = await User.findById(report.citizenId);
        if (reportAuthor && reportAuthor.role === "citizen" && reportAuthor.citizenProfile) {
          reportAuthor.citizenProfile.communityScore = Math.max(
            0,
            reportAuthor.citizenProfile.communityScore - 1
          );
          reportAuthor.markModified("citizenProfile");
          await reportAuthor.save();
        }
      }
      report.votes.push({ userId, voteType });
    }
  }

  await report.save();

  const userVote = report.votes.find((vote) => vote.userId.toString() === userId.toString());

  return res.status(200).json(
    new ApiResponse(200, "Vote updated successfully", {
      vote: report.vote,
      userVote: userVote ? userVote.voteType : null,
    })
  );
});

const getUserVote = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, "User vote fetched successfully", {
      vote: null,
    })
  );
});

const getAssignedReports = asyncHandler(async (req, res) => {
  if (req.user.role !== "worker") {
    throw new ApiError("Only workers can access this resource", 403);
  }

  const reports = await Report.find({
    "assignedTo.staffId": req.user._id,
    status: { $in: ["assigned", "in_progress"] },
  })
    .populate("citizenId", "fullname email")
    .sort({ createdAt: -1 });

  console.log(reports);
  return res
    .status(200)
    .json(new ApiResponse(200, "Assigned reports fetched successfully", reports));
});

const createSOSReport = asyncHandler(async (req, res) => {
  const citizenId = req.user?._id;
  const { description, latitude, longitude, timestamp } = req.body;

  if (!latitude || !longitude) {
    throw new ApiError("Location (latitude, longitude) is required for an SOS report", 400);
  }

  const newSOSReport = await Report.create({
    citizenId: citizenId,
    title: "SOS Alert",
    description: description || "SOS Alert Triggered",
    location: {
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
    },
    category: "emergency",
    priority: "critical",
    department: "public_safety",
    history: [
      {
        status: "submitted",
        updatedBy: citizenId,
        notes: "SOS Alert triggered automatically.",
        timestamp: timestamp ? new Date(timestamp) : new Date(),
      },
    ],
  });

  if (!newSOSReport) {
    throw new ApiError("Failed to create SOS report, please try again", 500);
  }

  console.log(`[SOS CREATED] Report ${newSOSReport._id} created for user ${citizenId}`);

  return res
    .status(201)
    .json(new ApiResponse(201, "SOS report created successfully", newSOSReport));
});

const getReportsByTitle = asyncHandler(async (req, res) => {
  const { title, page = 1, limit = 10 } = req.query;

  if (!title || !title.trim()) {
    throw new ApiError("Title parameter is required", 400);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const regex = new RegExp(title.trim(), "i");

  const reports = await Report.find({ title: { $regex: regex } })
    .populate("citizenId", "fullname email")
    .populate("assignee", "fullname email")
    .populate("assignedTo.staffId", "fullname email")
    .populate("comments.user", "fullname email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Report.countDocuments({ title: { $regex: regex } });

  return res.status(200).json(
    new ApiResponse(200, `Reports matching title: "${title}"`, {
      reports,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalReports: total,
      },
    })
  );
});

const getReportsByUserHistory = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError("User authentication required", 401);
  }

  const historyEntries = await Report.aggregate([
    {
      $match: {
        "history.updatedBy": userId,
      },
    },
    {
      $unwind: "$history",
    },
    {
      $match: {
        "history.updatedBy": userId,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "history.updatedBy",
        foreignField: "_id",
        as: "updatedByUser",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "citizenId",
        foreignField: "_id",
        as: "citizenUser",
      },
    },
    {
      $project: {
        _id: 0,
        status: "$history.status",
        updatedBy: { $arrayElemAt: ["$updatedByUser", 0] },
        timestamp: "$history.timestamp",
        notes: "$history.notes",
        report: {
          reportId: "$_id",
          citizenId: { $arrayElemAt: ["$citizenUser", 0] },
          title: "$title",
        },
      },
    },
    {
      $sort: { timestamp: -1 },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, "User history entries fetched successfully", historyEntries));
});

export {
  createReport,
  getReports,
  getReportById,
  assignReport,
  updateReportStatus,
  getReportHistory,
  getReportByLocation,
  getReportByDepartment,
  addComment,
  getComments,
  getReportsByPriority,
  getMyReports,
  voteOnReport,
  getUserVote,
  getAssignedReports,
  createSOSReport,
  getReportsByTitle,
  getReportsByUserHistory,
};
