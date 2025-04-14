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
        status: "Approved",
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
    const query = {};
    const { searchQuery, page = "1", limit = "10" } = req.query;
    // If there's a search query, search across multiple fields
    if (searchQuery) {
        const searchRegex = { $regex: searchQuery, $options: "i" };
        query.$or = [{ model: searchRegex }];
    }
    // Exclude requests with status "Pending"
    query.status = { $ne: "Pending" };
    // Pagination
    const currentPage = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (currentPage - 1) * pageSize;
    // Count total documents
    const totalListing = yield listing_model_1.default.countDocuments(query);
    // Get paginated + populated results
    const listing = yield listing_model_1.default.find(query).skip(skip).limit(pageSize).exec();
    (0, sendResponse_1.default)(res, {
        data: listing,
        meta: {
            total: totalListing,
            page: currentPage,
            limit: pageSize,
            totalPage: Math.ceil(totalListing / pageSize),
        },
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Listing retrieved successfully!",
    });
}));
exports.listingController = {
    createNewListing,
    getListingByRequestId,
    approveListing,
    dealerOfferRequest,
};
