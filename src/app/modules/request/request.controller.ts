import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import Request from "./request.model";
import { Types } from "mongoose";
import { DealerRequest } from "../dealerRequest/dealerRequest.model";

const createRequest = catchAsync(async (req, res) => {
  const result = await Request.create({
    ...req.body,
    userId: req.user?._id,
    timeline: [
      {
        status: "new",
        note: "New request received",
        date: new Date(),
      },
    ],
  });
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Finding the best deals for you...",
  });
});

export const getAllRequest = catchAsync(async (req, res) => {
  const requests = await Request.find()
    .populate("userId")
    .sort({ createdAt: "desc" });

  sendResponse(res, {
    data: requests,
    success: true,
    statusCode: httpStatus.OK,
    message: "Requests retrieved successfully!",
  });
});

export const getAllCustomerRequest = catchAsync(async (req, res) => {
  const requests = await Request.find({
    userId: new Types.ObjectId(req.user?._id),
  }).sort({ createdAt: "desc" });

  const result = await Promise.all(
    requests.map(async (request) => {
      const offerCount = await DealerRequest.find({
        requestId: new Types.ObjectId(request?._id),
      }).select("_id");

      return {
        ...request.toObject(), // ensure it's a plain object
        count: offerCount?.length || 0,
      };
    })
  );

  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Requests retrieved successfully!",
  });
});

export const requestController = {
  createRequest,
  getAllRequest,
  getAllCustomerRequest,
};
