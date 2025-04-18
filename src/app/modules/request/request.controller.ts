/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import Request from "./request.model";
import mongoose, { Types } from "mongoose";
import Timeline from "../timeline/timeline.modal";
import { AppError } from "../../errors/AppError";

const createRequest = catchAsync(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const newRequest = await Request.create(
      [
        {
          ...req.body,
          userId: req.user?._id,
          timeline: [
            {
              status: "new",
              note: "New request received",
              date: new Date(),
            },
          ],
        },
      ],
      { session }
    );

    await Timeline.create(
      [
        {
          requestId: newRequest[0]._id,
          status: "new",
          note: "New request received",
          date: new Date(),
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Request created successfully",
      data: newRequest[0],
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error || "Internal server error, Please try again!"
    );
  }
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
  const requests = await Request.aggregate([
    {
      $match: {
        userId: new Types.ObjectId(req.user?._id),
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $lookup: {
        from: "dealerrequests", // this should match the collection name
        localField: "_id",
        foreignField: "requestId",
        as: "dealerRequests",
      },
    },
    {
      $addFields: {
        count: { $size: "$dealerRequests" },
        listingId: {
          $cond: {
            if: { $gt: [{ $size: "$dealerRequests" }, 0] },
            then: { $arrayElemAt: ["$dealerRequests.listingId", 0] },
            else: null,
          },
        },
      },
    },
    {
      $project: {
        dealerRequests: 0, // exclude the array to clean up the result
      },
    },
  ]);

  sendResponse(res, {
    data: requests,
    success: true,
    statusCode: httpStatus.OK,
    message: "Requests retrieved successfully!",
  });
});

export const getAllTimeLine = catchAsync(async (req, res) => {
  const result = await Timeline.find({
    requestId: new Types.ObjectId(req.params.id),
  });
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
  getAllTimeLine,
};
