import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthcheck = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, "Server is healthy", {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    })
  );
});

export { healthcheck };
