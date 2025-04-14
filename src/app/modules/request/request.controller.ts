/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import Request from "./request.model";

const createRequest = catchAsync(async (req, res) => {
  const result = await Request.create({ ...req.body, userId: req.user?._id });
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Finding the best deals for you...",
  });
});

export const getAllRequest = catchAsync(async (req, res) => {
  console.log("jhsdxghsr");
  const query: Record<string, any> = {};
  const { searchQuery, page = "1", limit = "10" } = req.query;

  // If there's a search query, search across multiple fields
  if (searchQuery) {
    const searchRegex = { $regex: searchQuery, $options: "i" };
    query.$or = [{ model: searchRegex }];
  }

  // Pagination
  const currentPage = parseInt(page as string, 10);
  const pageSize = parseInt(limit as string, 10);
  const skip = (currentPage - 1) * pageSize;

  // Count total documents
  const totalRequests = await Request.countDocuments(query);

  // Get paginated + populated results
  const requests = await Request.find(query)
    .populate("userId") // assuming RequestModel.user is a ref to User
    .skip(skip)
    .limit(pageSize)
    .exec();

  sendResponse(res, {
    data: requests,
    meta: {
      total: totalRequests,
      page: currentPage,
      limit: pageSize,
      totalPage: Math.ceil(totalRequests / pageSize),
    },
    success: true,
    statusCode: httpStatus.OK,
    message: "Requests retrieved successfully!",
  });
});

export const requestController = {
  createRequest,
  getAllRequest,
};
