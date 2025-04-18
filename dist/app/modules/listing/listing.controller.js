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
const timeline_modal_1 = __importDefault(require("../timeline/timeline.modal"));
const createNewListing = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { data } = req.body;
        const imageFiles = req.files;
        if (!data) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Missing data in request body");
        }
        let parsedData;
        try {
            parsedData = JSON.parse(data);
        }
        catch (_a) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Invalid JSON in data field");
        }
        const images = (imageFiles === null || imageFiles === void 0 ? void 0 : imageFiles.map((file) => (file === null || file === void 0 ? void 0 : file.path) ? `${config_1.default.server_url}/${file.path}` : null).filter(Boolean)) || [];
        const request = yield request_model_1.default.findById(parsedData === null || parsedData === void 0 ? void 0 : parsedData.requestId).session(session);
        if (!request) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Request not found");
        }
        yield timeline_modal_1.default.create([
            {
                status: "sent",
                note: `Listing sent to dealer: ${parsedData.make} ${parsedData.model}`,
                date: new Date(),
                requestId: request === null || request === void 0 ? void 0 : request._id,
            },
        ], { session });
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
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
const preApproveListingStatusUpdate = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield listing_model_1.default.findByIdAndUpdate(req.params.id, {
        status: "Pre-Approval",
        sentToDealerDate: new Date(),
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
    // Get all DealerRequests for this dealer
    const dealerRequests = yield dealerRequest_model_1.DealerRequest.find({
        dealerId: new mongoose_1.Types.ObjectId(req.user._id),
    }).select("_id");
    // Extract all listingIds that the dealer has already requested
    const requestedListingIds = dealerRequests.map((req) => req.listingId.toString());
    // Find listings with "Pre-Approval" status AND not already requested by this dealer
    const listings = yield listing_model_1.default.find({
        status: "Pre-Approval",
        _id: { $nin: requestedListingIds },
    })
        .sort({ createdAt: "desc" })
        .populate("requestId", "budget");
    (0, sendResponse_1.default)(res, {
        data: listings,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Filtered listings retrieved successfully!",
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
    }).select("_id listingId allInPrice");
    const allInPrice = listingRequest === null || listingRequest === void 0 ? void 0 : listingRequest.map((list) => list.allInPrice);
    const min = Math.min(...allInPrice);
    const max = Math.min(...allInPrice);
    const result = listing.map((list) => {
        const matchCount = listingRequest.filter((req) => req.listingId.toString() === list._id.toString()).length;
        return Object.assign(Object.assign({}, list.toObject()), { count: matchCount, min,
            max });
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
const updateListing = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = req.body;
    const parseData = JSON.parse(data);
    const payload = Object.assign({}, parseData);
    let newImages = [];
    if (req.files) {
        newImages = req.files.map((file) => `${config_1.default.server_url}/${file.path}`);
    }
    payload.images = [...parseData.existingImages, ...newImages];
    const result = yield listing_model_1.default.findByIdAndUpdate(req.params.id, {
        $set: Object.assign({}, payload),
    }, {
        new: true,
    });
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Car updated successfully!",
    });
}));
const getPreApprovalListing = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listing = yield listing_model_1.default.find({
        status: "Pre-Approval",
    })
        .populate("requestId", "_id budget")
        .populate("userId")
        .sort({ createdAt: "desc" });
    (0, sendResponse_1.default)(res, {
        data: listing,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Listings offeres retrieved successfully!",
    });
}));
exports.listingController = {
    createNewListing,
    getListingByRequestId,
    preApproveListingStatusUpdate,
    dealerOfferRequest,
    getUserListing,
    getListingOffers,
    updateListing,
    getPreApprovalListing,
};
