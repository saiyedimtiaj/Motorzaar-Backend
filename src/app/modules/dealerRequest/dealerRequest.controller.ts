/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Types } from "mongoose";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import Request from "../request/request.model";
import { AppError } from "../../errors/AppError";
import { DealerRequest } from "./dealerRequest.model";
import sendResponse from "../../utils/sendResponse";
import Listing from "../listing/listing.model";
import { nanoid } from "nanoid";
import Timeline from "../timeline/timeline.modal";

const addDepositPaid = catchAsync(async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const request = await Request.findById(req?.body?.requestId)
      .select("_id")
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

    await Timeline.create(
      [
        {
          status: "price-submitted",
          note: `price-submitted ${req.body?.allInPrice}`,
          date: new Date(),
          requestId: request?._id,
        },
      ],
      { session }
    );
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

const rejectOffer = catchAsync(async (req, res) => {
  const request = await Request.findById(req?.body?.requestId).select("_id ");

  if (!request) {
    throw new AppError(httpStatus.NOT_FOUND, "Request not found!");
  }

  const offerId = nanoid(6);

  // Create DealerRequest with the same session
  const result = await DealerRequest.create({
    ...req.body,
    offerId,
    status: "reject",
  });

  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Offer reject successfully!",
  });
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
      $in: ["Deposit Paid", "auction-won", "ready", "Auction Lost", "Approved"],
    },
  })
    .populate("listingId")
    .populate("dealerId", "_id email phone")
    .sort({ createdAt: "desc" });

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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      throw new AppError(httpStatus.BAD_REQUEST, "Status is required");
    }

    const result = await DealerRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true, session }
    );

    if (!result) {
      throw new AppError(httpStatus.NOT_FOUND, "DealerRequest not found");
    }

    if (status === "auction-lost") {
      await Timeline.create(
        [
          {
            status: "auction-lost",
            note: "Dealer lost auction: Vehicle sold above maximum price",
            date: new Date(),
            requestId: result.requestId,
          },
        ],
        { session }
      );
    } else if (status === "auction-won") {
      await Timeline.create(
        [
          {
            status: "auction-won",
            note: `Dealer won auction: £${result.allInPrice}`,
            date: new Date(),
            requestId: result.requestId,
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    sendResponse(res, {
      data: result,
      success: true,
      statusCode: httpStatus.OK,
      message: "Updated auction status successfully!",
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Auction status update failed, please try again"
    );
  }
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

const getSubmitedPricesByRequestId = catchAsync(async (req, res) => {
  const result = await DealerRequest.find({
    requestId: new Types.ObjectId(req.params.id),
  })
    .populate("dealerId")
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
  getSubmitedPricesByRequestId,
  rejectOffer,
};
