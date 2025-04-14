/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import config from "../../config";
import Request from "../request/request.model";
import Listing from "./listing.model"; // Assuming your Listing model is here
import mongoose, { Types } from "mongoose";
import { AppError } from "../../errors/AppError";

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
  const query: Record<string, any> = {};
  const { searchQuery, page = "1", limit = "10" } = req.query;

  // If there's a search query, search across multiple fields
  if (searchQuery) {
    const searchRegex = { $regex: searchQuery, $options: "i" };
    query.$or = [{ model: searchRegex }];
  }

  // Exclude requests with status "Pending"
  query.status = { $ne: "Pending" };

  // Pagination
  const currentPage = parseInt(page as string, 10);
  const pageSize = parseInt(limit as string, 10);
  const skip = (currentPage - 1) * pageSize;

  // Count total documents
  const totalListing = await Listing.countDocuments(query);

  // Get paginated + populated results
  const listing = await Listing.find(query).skip(skip).limit(pageSize).exec();

  sendResponse(res, {
    data: listing,
    meta: {
      total: totalListing,
      page: currentPage,
      limit: pageSize,
      totalPage: Math.ceil(totalListing / pageSize),
    },
    success: true,
    statusCode: httpStatus.OK,
    message: "Listing retrieved successfully!",
  });
});

export const listingController = {
  createNewListing,
  getListingByRequestId,
  approveListing,
  dealerOfferRequest,
};
