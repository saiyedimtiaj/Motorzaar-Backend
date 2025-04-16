"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listingController = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const config_1 = __importDefault(require("../../config"));
const request_model_1 = __importDefault(require("../request/request.model"));
const listing_model_1 = __importDefault(require("./listing.model")); // Assuming your Listing model is here
const mongoose_1 = __importStar(require("mongoose"));
const AppError_1 = require("../../errors/AppError");
const dealerRequest_model_1 = require("../dealerRequest/dealerRequest.model");
const auth_modal_1 = require("../auth/auth.modal");
const createNewListing = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { data } = req.body;
        const imageFiles = req.files;
        // Ensure data and files exist
        if (!data) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Missing data in request body");
        }
        const parsedData = JSON.parse(data);
        const images = (imageFiles === null || imageFiles === void 0 ? void 0 : imageFiles.map((file) => `${config_1.default.server_url}/${file.path}`)) || [];
        const request = yield request_model_1.default.findById(parsedData === null || parsedData === void 0 ? void 0 : parsedData.requestId).session(session);
        if (!request) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Request not found");
        }
        const alreadySent = (_a = request.timeline) === null || _a === void 0 ? void 0 : _a.some((item) => item.status === "sent");
        // Add timeline entry if not already "sent"
        if (!alreadySent) {
            request.timeline.push({
                status: "sent",
                note: `Listing sent to dealer: ${parsedData.make} ${parsedData.model}`,
                date: new Date(),
            });
            yield request.save({ session });
        }
        // Create new listing
        const result = yield listing_model_1.default.create([Object.assign(Object.assign({}, parsedData), { images })], {
            session,
        });
        yield session.commitTransaction();
        session.endSession();
        (0, sendResponse_1.default)(res, {
            data: result[0],
            success: true,
            statusCode: http_status_1.default.OK,
            message: "Listing added successfully",
        });
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        console.error("Transaction error:", error);
        throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to create listing , try again .");
    }
}));
const getListingByRequestId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield listing_model_1.default.find({
        requestId: new mongoose_1.Types.ObjectId(req.params.id),
    });
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: " successfully",
    });
}));
const approveListing = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield listing_model_1.default.findByIdAndUpdate(req.params.id, {
        status: "Pre-Approval",
    }, {
        new: true,
    });
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "car is now approve for listing successfully",
    });
}));
const dealerOfferRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const dealer = yield auth_modal_1.Users.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
    if (!dealer) {
        throw new Error("Dealer not found!");
    }
    const { searchQuery, page = "1", limit = "10" } = req.query;
    const query = {
        createdAt: { $gte: dealer === null || dealer === void 0 ? void 0 : dealer.createdAt },
        status: { $ne: "Pending" },
    };
    // Search logic
    if (searchQuery) {
        const searchRegex = { $regex: searchQuery, $options: "i" };
        query.$or = [{ model: searchRegex }];
    }
    // Pagination
    const currentPage = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (currentPage - 1) * pageSize;
    // Total count
    const totalListing = yield listing_model_1.default.countDocuments(query);
    // Fetch listings
    const listings = yield listing_model_1.default.find(query)
        .populate("requestId")
        .skip(skip)
        .limit(pageSize)
        .lean();
    // Fetch all dealer requests for this dealer in one query
    const dealerRequests = yield dealerRequest_model_1.DealerRequest.find({
        dealerId: new mongoose_1.Types.ObjectId((_b = req.user) === null || _b === void 0 ? void 0 : _b._id),
    }).lean();
    // Map of listingId -> status
    const requestStatusMap = {};
    dealerRequests.forEach((req) => {
        requestStatusMap[req.listingId.toString()] = req.status;
    });
    // Attach dealerRequest status to each listing
    const enrichedListings = listings.map((listing) => {
        const dealerStatus = requestStatusMap[listing._id.toString()];
        return Object.assign(Object.assign({}, listing), { status: dealerStatus || listing.status });
    });
    // Final response
    (0, sendResponse_1.default)(res, {
        data: enrichedListings,
        meta: {
            total: totalListing,
            page: currentPage,
            limit: pageSize,
            totalPage: Math.ceil(totalListing / pageSize),
        },
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Listings retrieved successfully!",
    });
}));
const getUserListing = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const listing = yield listing_model_1.default.find({
        userId: new mongoose_1.Types.ObjectId((_a = req.user) === null || _a === void 0 ? void 0 : _a._id),
        status: { $nin: ["Pending", "Pre-Approval"] },
    }).populate("requestId", "_id budget");
    // Get all listing IDs
    const listingIds = listing.map((item) => item._id);
    const listingRequest = yield dealerRequest_model_1.DealerRequest.find({
        listingId: { $in: listingIds },
    }).select("_id listingId");
    const result = listing.map((list) => {
        const matchCount = listingRequest.filter((req) => req.listingId.toString() === list._id.toString()).length;
        return Object.assign(Object.assign({}, list.toObject()), { count: matchCount });
    });
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Listings retrieved successfully!",
    });
}));
const getListingOffers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const listing = yield listing_model_1.default.findById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id)
        .select("_id make model year")
        .populate("requestId", "_id budget");
    const listingRequest = yield dealerRequest_model_1.DealerRequest.find({
        listingId: req.params.id,
    }).populate("dealerId");
    (0, sendResponse_1.default)(res, {
        data: { listing, listingRequest },
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Listings offeres retrieved successfully!",
    });
}));
exports.listingController = {
    createNewListing,
    getListingByRequestId,
    approveListing,
    dealerOfferRequest,
    getUserListing,
    getListingOffers,
};
