/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import config from "../../config";
import Request from "../request/request.model";
import Listing from "./listing.model"; // Assuming your Listing model is here
import mongoose, { Types } from "mongoose";
import { AppError } from "../../errors/AppError";
import { DealerRequest } from "../dealerRequest/dealerRequest.model";
import { Users } from "../auth/auth.modal";

const createNewListing = catchAsync(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { data } = req.body;
    const imageFiles = req.files as Express.Multer.File[];

    // Ensure data and files exist
    if (!data) {
      throw new AppError(httpStatus.NOT_FOUND, "Missing data in request body");
    }

    const parsedData = JSON.parse(data);
    const images =
      imageFiles?.map((file) => `${config.server_url}/${file.path}`) || [];

    const request = await Request.findById(parsedData?.requestId).session(
      session
    );

    if (!request) {
      throw new AppError(httpStatus.NOT_FOUND, "Request not found");
    }

    const alreadySent = request.timeline?.some(
      (item: any) => item.status === "sent"
    );

    // Add timeline entry if not already "sent"
    if (!alreadySent) {
      request.timeline.push({
        status: "sent",
        note: `Listing sent to dealer: ${parsedData.make} ${parsedData.model}`,
        date: new Date(),
      });
      await request.save({ session });
    }

    // Create new listing
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
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Transaction error:", error);
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

const approveListing = catchAsync(async (req, res) => {
  const result = await Listing.findByIdAndUpdate(
    req.params.id,
    {
      status: "Approved",
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
  const dealer = await Users.findById(req.user?._id);
  if (!dealer) {
    throw new Error("Dealer not found!");
  }

  const { searchQuery, page = "1", limit = "10" } = req.query;

  const query: Record<string, any> = {
    createdAt: { $gte: dealer?.createdAt },
    status: { $ne: "Pending" },
  };

  // Search logic
  if (searchQuery) {
    const searchRegex = { $regex: searchQuery, $options: "i" };
    query.$or = [{ model: searchRegex }];
  }

  // Pagination
  const currentPage = parseInt(page as string, 10);
  const pageSize = parseInt(limit as string, 10);
  const skip = (currentPage - 1) * pageSize;

  // Total count
  const totalListing = await Listing.countDocuments(query);

  // Fetch listings
  const listings = await Listing.find(query).skip(skip).limit(pageSize).lean();

  // Fetch all dealer requests for this dealer in one query
  const dealerRequests = await DealerRequest.find({
    dealerId: new Types.ObjectId(req.user?._id),
  }).lean();

  // Map of listingId -> status
  const requestStatusMap: Record<string, string> = {};
  dealerRequests.forEach((req) => {
    requestStatusMap[req.listingId.toString()] = req.status;
  });

  // Attach dealerRequest status to each listing
  const enrichedListings = listings.map((listing) => {
    const dealerStatus = requestStatusMap[listing._id.toString()];
    return {
      ...listing,
      status: dealerStatus || listing.status,
    };
  });

  // Final response
  sendResponse(res, {
    data: enrichedListings,
    meta: {
      total: totalListing,
      page: currentPage,
      limit: pageSize,
      totalPage: Math.ceil(totalListing / pageSize),
    },
    success: true,
    statusCode: httpStatus.OK,
    message: "Listings retrieved successfully!",
  });
});

const getUserListing = catchAsync(async (req, res) => {
  const listing = await Listing.find({
    userId: new Types.ObjectId(req.user?._id),
  }).populate("requestId", "_id budget");

  // Get all listing IDs
  const listingIds = listing.map((item) => item._id);

  const listingRequest = await DealerRequest.find({
    listingId: { $in: listingIds },
  }).select("_id listingId");

  const result = listing.map((list) => {
    const matchCount = listingRequest.filter(
      (req) => req.listingId.toString() === list._id.toString()
    ).length;

    return {
      ...list.toObject(),
      count: matchCount,
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

export const listingController = {
  createNewListing,
  getListingByRequestId,
  approveListing,
  dealerOfferRequest,
  getUserListing,
  getListingOffers,
};
