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
exports.dealerRequestController = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importStar(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const request_model_1 = __importDefault(require("../request/request.model"));
const AppError_1 = require("../../errors/AppError");
const dealerRequest_model_1 = require("./dealerRequest.model");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const listing_model_1 = __importDefault(require("../listing/listing.model"));
const nanoid_1 = require("nanoid");
const timeline_modal_1 = __importDefault(require("../timeline/timeline.modal"));
const addDepositPaid = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const request = yield request_model_1.default.findById((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.requestId)
            .select("_id timeline")
            .session(session);
        if (!request) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Request not found!");
        }
        const listing = yield listing_model_1.default.findById((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.listingId)
            .select("_id status")
            .session(session);
        if (!listing) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Listing not found!");
        }
        if (listing.status !== "Approved") {
            yield listing_model_1.default.findByIdAndUpdate((_c = req.body) === null || _c === void 0 ? void 0 : _c.listingId, {
                status: "Approved",
            }, {
                new: true,
                session,
            });
        }
        yield timeline_modal_1.default.create([
            {
                status: "price-submitted",
                note: `price-submitted ${(_d = req.body) === null || _d === void 0 ? void 0 : _d.allInPrice}`,
                date: new Date(),
                requestId: request === null || request === void 0 ? void 0 : request._id,
            },
        ], { session });
        // Generate a 6-character unique offerId
        const offerId = (0, nanoid_1.nanoid)(6);
        // Create DealerRequest with the same session
        const result = yield dealerRequest_model_1.DealerRequest.create([
            Object.assign(Object.assign({}, req.body), { offerId }),
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        (0, sendResponse_1.default)(res, {
            data: result[0],
            success: true,
            statusCode: http_status_1.default.OK,
            message: "Deposit price added successfully!",
        });
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
}));
const viewDepositDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const result = yield dealerRequest_model_1.DealerRequest.findOne({
        dealerId: new mongoose_1.Types.ObjectId((_a = req.user) === null || _a === void 0 ? void 0 : _a._id),
        listingId: new mongoose_1.Types.ObjectId((_b = req.params) === null || _b === void 0 ? void 0 : _b.id),
    }).select("_id dealerId listingId allInPrice");
    (0, sendResponse_1.default)(res, {
        data: result, // Because create returns an array when used with session
        success: true,
        statusCode: http_status_1.default.OK,
        message: "successfully!",
    });
}));
const dealerRequestDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield dealerRequest_model_1.DealerRequest.findById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id)
        .populate("listingId")
        .populate("dealerId");
    (0, sendResponse_1.default)(res, {
        data: result, // Because create returns an array when used with session
        success: true,
        statusCode: http_status_1.default.OK,
        message: "successfully!",
    });
}));
const customerOffers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield dealerRequest_model_1.DealerRequest.find({
        userId: new mongoose_1.Types.ObjectId((_a = req.user) === null || _a === void 0 ? void 0 : _a._id),
        status: {
            $in: ["Deposit Paid", "auction-won", "ready", "Auction Lost"],
        },
    })
        .populate("listingId")
        .populate("dealerId", "_id email phone");
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Successfully fetched customer offers!",
    });
}));
const getDealeSubmitedOffersListing = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield dealerRequest_model_1.DealerRequest.find({
        dealerId: new mongoose_1.Types.ObjectId((_a = req.user) === null || _a === void 0 ? void 0 : _a._id),
        status: { $in: req.query.status },
    })
        .sort({ createdAt: "desc" })
        .populate("listingId");
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Listings retrieved successfully!",
    });
}));
const updateAuctionStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Status is required");
        }
        const result = yield dealerRequest_model_1.DealerRequest.findByIdAndUpdate(id, { status }, { new: true, session });
        if (!result) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "DealerRequest not found");
        }
        if (status === "auction-lost") {
            yield timeline_modal_1.default.create([
                {
                    status: "auction-lost",
                    note: "Dealer lost auction: Vehicle sold above maximum price",
                    date: new Date(),
                    requestId: result.requestId,
                },
            ], { session });
        }
        else if (status === "auction-won") {
            yield timeline_modal_1.default.create([
                {
                    status: "auction-won",
                    note: `Dealer won auction: £${result.allInPrice}`,
                    date: new Date(),
                    requestId: result.requestId,
                },
            ], { session });
        }
        yield session.commitTransaction();
        session.endSession();
        (0, sendResponse_1.default)(res, {
            data: result,
            success: true,
            statusCode: http_status_1.default.OK,
            message: "Updated auction status successfully!",
        });
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, "Auction status update failed, please try again");
    }
}));
const getSubmitedPrices = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield dealerRequest_model_1.DealerRequest.find()
        .populate("listingId")
        .populate("userId")
        .sort({ createdAt: "desc" });
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Update auction status sucessfully!",
    });
}));
const getSubmitedPricesByRequestId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield dealerRequest_model_1.DealerRequest.find({
        requestId: new mongoose_1.Types.ObjectId(req.params.id),
    })
        .populate("dealerId")
        .sort({ createdAt: "desc" });
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Update auction status sucessfully!",
    });
}));
exports.dealerRequestController = {
    addDepositPaid,
    viewDepositDetails,
    dealerRequestDetails,
    customerOffers,
    getDealeSubmitedOffersListing,
    updateAuctionStatus,
    getSubmitedPrices,
    getSubmitedPricesByRequestId,
};
