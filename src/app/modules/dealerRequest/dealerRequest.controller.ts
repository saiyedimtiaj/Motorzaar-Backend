import mongoose, { Types } from "mongoose";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import Request from "../request/request.model";
import { AppError } from "../../errors/AppError";
import { DealerRequest } from "./dealerRequest.model";
import sendResponse from "../../utils/sendResponse";
const addDepositPaid = catchAsync(async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const request = await Request.findById(req?.body?.requestId)
      .select("_id timeline")
      .session(session);

    if (!request) {
      throw new AppError(httpStatus.NOT_FOUND, "Request not found!");
    }

    // Push new timeline update
    request.timeline.push({
      status: "price-submitted",
      note: `price-submitted ${req.body?.allInPrice}`,
      date: new Date(),
    });

    await request.save({ session });

    // Create DealerRequest with the same session
    const result = await DealerRequest.create([req.body], { session });

    await session.commitTransaction();
    session.endSession();

    sendResponse(res, {
      data: result[0], // Because create returns an array when used with session
      success: true,
      statusCode: httpStatus.OK,
      message: "Deposit price added successfully!",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error; // Will be caught by catchAsync
  }
});

const viewDepositDetails = catchAsync(async (req, res) => {
  const result = await DealerRequest.findOne({
    dealerId: new Types.ObjectId(req.user?._id),
    listingId: new Types.ObjectId(req.params?.id),
  }).select("_id dealerId listingId allInPrice");

  sendResponse(res, {
    data: result, // Because create returns an array when used with session
    success: true,
    statusCode: httpStatus.OK,
    message: "successfully!",
  });
});

const dealerRequestDetails = catchAsync(async (req, res) => {
  const result = await DealerRequest.findById(req.params?.id)
    .populate("listingId")
    .populate("dealerId");
  sendResponse(res, {
    data: result, // Because create returns an array when used with session
    success: true,
    statusCode: httpStatus.OK,
    message: "successfully!",
  });
});

export const dealerRequestController = {
  addDepositPaid,
  viewDepositDetails,
  dealerRequestDetails,
};
