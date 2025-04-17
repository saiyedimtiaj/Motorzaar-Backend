import mongoose, { Types } from "mongoose";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import Request from "../request/request.model";
import { AppError } from "../../errors/AppError";
import { DealerRequest } from "./dealerRequest.model";
import sendResponse from "../../utils/sendResponse";
import Listing from "../listing/listing.model";
import { nanoid } from "nanoid";

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

    const listing = await Listing.findById(req?.body?.listingId)
      .select("_id status")
      .session(session);

    if (!listing) {
      throw new AppError(httpStatus.NOT_FOUND, "Listing not found!");
    }

    if (listing.status !== "Approved") {
      await Listing.findByIdAndUpdate(
        req.body?.listingId,
        {
          status: "Approved",
        },
        {
          new: true,
          session,
        }
      );
    }

    // Push new timeline update
    request.timeline.push({
      status: "price-submitted",
      note: `price-submitted ${req.body?.allInPrice}`,
      date: new Date(),
    });

    await request.save({ session });

    // Generate a 6-character unique offerId
    const offerId = nanoid(6);

    // Create DealerRequest with the same session
    const result = await DealerRequest.create(
      [
        {
          ...req.body,
          offerId,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    sendResponse(res, {
      data: result[0],
      success: true,
      statusCode: httpStatus.OK,
      message: "Deposit price added successfully!",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
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

const customerOffers = catchAsync(async (req, res) => {
  const result = await DealerRequest.find({
    userId: new Types.ObjectId(req.user?._id),
    status: {
      $in: [
        "Deposit Paid",
        "Auction Won",
        "Test Drive & Collection Ready",
        "Auction Lost",
      ],
    },
  })
    .populate("listingId")
    .populate("dealerId", "_id email phone");

  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully fetched customer offers!",
  });
});

const getDealeSubmitedOffersListing = catchAsync(async (req, res) => {
  const result = await DealerRequest.find({
    dealerId: new Types.ObjectId(req.user?._id),
    status: { $in: req.query.status },
  })
    .sort({ createdAt: "desc" })
    .populate("listingId");

  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Listings retrieved successfully!",
  });
});

const updateAuctionStatus = catchAsync(async (req, res) => {
  const result = await DealerRequest.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body?.status,
    },
    {
      new: true,
    }
  );
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Update auction status sucessfully!",
  });
});

const getSubmitedPrices = catchAsync(async (req, res) => {
  const result = await DealerRequest.find()
    .populate("listingId")
    .populate("userId")
    .sort({ createdAt: "desc" });
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Update auction status sucessfully!",
  });
});

export const dealerRequestController = {
  addDepositPaid,
  viewDepositDetails,
  dealerRequestDetails,
  customerOffers,
  getDealeSubmitedOffersListing,
  updateAuctionStatus,
  getSubmitedPrices,
};
