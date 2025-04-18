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
exports.requestController = exports.getAllTimeLine = exports.getAllCustomerRequest = exports.getAllRequest = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const request_model_1 = __importDefault(require("./request.model"));
const mongoose_1 = __importStar(require("mongoose"));
const timeline_modal_1 = __importDefault(require("../timeline/timeline.modal"));
const AppError_1 = require("../../errors/AppError");
const createRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const newRequest = yield request_model_1.default.create([
            Object.assign(Object.assign({}, req.body), { userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id, timeline: [
                    {
                        status: "new",
                        note: "New request received",
                        date: new Date(),
                    },
                ] }),
        ], { session });
        yield timeline_modal_1.default.create([
            {
                requestId: newRequest[0]._id,
                status: "new",
                note: "New request received",
                date: new Date(),
            },
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        res.status(201).json({
            success: true,
            message: "Request created successfully",
            data: newRequest[0],
        });
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, error || "Internal server error, Please try again!");
    }
}));
exports.getAllRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requests = yield request_model_1.default.find()
        .populate("userId")
        .sort({ createdAt: "desc" });
    (0, sendResponse_1.default)(res, {
        data: requests,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Requests retrieved successfully!",
    });
}));
exports.getAllCustomerRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const requests = yield request_model_1.default.aggregate([
        {
            $match: {
                userId: new mongoose_1.Types.ObjectId((_a = req.user) === null || _a === void 0 ? void 0 : _a._id),
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $lookup: {
                from: "dealerrequests", // this should match the collection name
                localField: "_id",
                foreignField: "requestId",
                as: "dealerRequests",
            },
        },
        {
            $addFields: {
                count: { $size: "$dealerRequests" },
                listingId: {
                    $cond: {
                        if: { $gt: [{ $size: "$dealerRequests" }, 0] },
                        then: { $arrayElemAt: ["$dealerRequests.listingId", 0] },
                        else: null,
                    },
                },
            },
        },
        {
            $project: {
                dealerRequests: 0, // exclude the array to clean up the result
            },
        },
    ]);
    (0, sendResponse_1.default)(res, {
        data: requests,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Requests retrieved successfully!",
    });
}));
exports.getAllTimeLine = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield timeline_modal_1.default.find({
        requestId: new mongoose_1.Types.ObjectId(req.params.id),
    });
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Requests retrieved successfully!",
    });
}));
exports.requestController = {
    createRequest,
    getAllRequest: exports.getAllRequest,
    getAllCustomerRequest: exports.getAllCustomerRequest,
    getAllTimeLine: exports.getAllTimeLine,
};
