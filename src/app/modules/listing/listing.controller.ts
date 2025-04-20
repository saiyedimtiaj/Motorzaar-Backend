/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import Request from "../request/request.model";
import Listing from "./listing.model"; // Assuming your Listing model is here
import mongoose, { Types } from "mongoose";
import { AppError } from "../../errors/AppError";
import { DealerRequest } from "../dealerRequest/dealerRequest.model";
import { TListing } from "./listing.interface";
import Timeline from "../timeline/timeline.modal";

const createNewListing = catchAsync(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { data } = req.body;
    const imageFiles = req.files as Express.Multer.File[];

    if (!data) {
      throw new AppError(httpStatus.NOT_FOUND, "Missing data in request body");
    }

    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid JSON in data field");
    }

    const images =
      imageFiles
        ?.map((file) => (file?.path ? file.path : null))
        .filter(Boolean) || [];

    const request = await Request.findById(parsedData?.requestId).session(
      session
    );

    if (!request) {
      throw new AppError(httpStatus.NOT_FOUND, "Request not found");
    }

    await Timeline.create(
      [
        {
          status: "sent",
          note: `Listing sent to dealer: ${parsedData.make} ${parsedData.model}`,
          date: new Date(),
          requestId: request?._id,
        },
      ],
      { session }
    );

    const result = await Listing.create([{ ...parsedData, images }], {
      session,
    });

    await session.commitTransaction();
    session.endSession();

    sendResponse(res, {
      data: result[0],
      success: true,
      statusCode: httpStatus.OK,
      message: "Listing added successfully",
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create listing , try again ."
    );
  }
});

const getListingByRequestId = catchAsync(async (req, res) => {
  const result = await Listing.find({
    requestId: new Types.ObjectId(req.params.id),
  });
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: " successfully",
  });
});

const preApproveListingStatusUpdate = catchAsync(async (req, res) => {
  const result = await Listing.findByIdAndUpdate(
    req.params.id,
    {
      status: "Pre-Approval",
      sentToDealerDate: new Date(),
    },
    {
      new: true,
    }
  );
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "car is now approve for listing successfully",
  });
});

const dealerOfferRequest = catchAsync(async (req, res) => {
  // Get all DealerRequests for this dealer, include listingId field
  const dealerRequests = await DealerRequest.find({
    dealerId: new Types.ObjectId(req.user._id),
  }).select("listingId");

  // Extract all listingIds that the dealer has already requested
  const requestedListingIds = dealerRequests.map((req) =>
    req.listingId?.toString()
  );

  // Find listings with "Pre-Approval" status AND not already requested by this dealer
  const listings = await Listing.find({
    status: "Pre-Approval",
    _id: { $nin: requestedListingIds },
  })
    .sort({ createdAt: "desc" })
    .populate("requestId", "budget");

  sendResponse(res, {
    data: listings,
    success: true,
    statusCode: httpStatus.OK,
    message: "Filtered listings retrieved successfully!",
  });
});

const getUserListing = catchAsync(async (req, res) => {
  const listing = await Listing.find({
    userId: new Types.ObjectId(req.user?._id),
    status: { $nin: ["Pending", "Pre-Approval"] },
  }).populate("requestId", "_id budget");

  // Get all listing IDs
  const listingIds = listing.map((item) => item._id);

  const listingRequest = await DealerRequest.find({
    listingId: { $in: listingIds },
  }).select("_id listingId allInPrice");

  const allInPrice = listingRequest?.map((list) => list.allInPrice);
  const min = Math.min(...allInPrice);
  const max = Math.min(...allInPrice);

  const result = listing.map((list) => {
    const matchCount = listingRequest.filter(
      (req) => req.listingId.toString() === list._id.toString()
    ).length;

    return {
      ...list.toObject(),
      count: matchCount,
      min,
      max,
    };
  });

  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Listings retrieved successfully!",
  });
});

const getListingOffers = catchAsync(async (req, res) => {
  const listing = await Listing.findById(req.params?.id)
    .select("_id make model year")
    .populate("requestId", "_id budget");
  const listingRequest = await DealerRequest.find({
    listingId: req.params.id,
  }).populate("dealerId");
  sendResponse(res, {
    data: { listing, listingRequest },
    success: true,
    statusCode: httpStatus.OK,
    message: "Listings offeres retrieved successfully!",
  });
});

const updateListing = catchAsync(async (req, res) => {
  const { data } = req.body;
  const parseData = JSON.parse(data);
  const payload: TListing = { ...parseData };

  let newImages: string[] = [];
  if (req.files) {
    newImages = (req.files as Express.Multer.File[]).map((file) => file.path);
  }

  payload.images = [...parseData.existingImages, ...newImages];

  const result = await Listing.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        ...payload,
      },
    },
    {
      new: true,
    }
  );

  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Car updated successfully!",
  });
});

const getPreApprovalListing = catchAsync(async (req, res) => {
  const listing = await Listing.find({
    status: { $in: ["Approved", "Pre-Approval"] },
  })
    .populate("requestId")
    .populate("userId", "_id fullName email")
    .sort({ createdAt: "desc" });
  sendResponse(res, {
    data: listing,
    success: true,
    statusCode: httpStatus.OK,
    message: "Listings offeres retrieved successfully!",
  });
});

export const listingController = {
  createNewListing,
  getListingByRequestId,
  preApproveListingStatusUpdate,
  dealerOfferRequest,
  getUserListing,
  getListingOffers,
  updateListing,
  getPreApprovalListing,
};
