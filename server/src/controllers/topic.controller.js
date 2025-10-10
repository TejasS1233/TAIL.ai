import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Topic } from "../models/topic.model.js";

// Fetches all topics, sorted alphabetically.
const getTopics = asyncHandler(async (req, res) => {
  const topics = await Topic.find().sort({ name: 1 });
  return res.status(200).json(new ApiResponse(200, topics, "Topics fetched successfully"));
});

export { getTopics };
