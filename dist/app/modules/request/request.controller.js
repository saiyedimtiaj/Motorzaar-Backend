"use strict";
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
exports.requestController = exports.getAllCustomerRequest = exports.getAllRequest = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const request_model_1 = __importDefault(require("./request.model"));
const mongoose_1 = require("mongoose");
const dealerRequest_model_1 = require("../dealerRequest/dealerRequest.model");
const createRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield request_model_1.default.create(Object.assign(Object.assign({}, req.body), { userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id, timeline: [
            {
                status: "new",
                note: "New request received",
                date: new Date(),
            },
        ] }));
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Finding the best deals for you...",
    });
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
    const requests = yield request_model_1.default.find({
        userId: new mongoose_1.Types.ObjectId((_a = req.user) === null || _a === void 0 ? void 0 : _a._id),
    }).sort({ createdAt: "desc" });
    const result = yield Promise.all(requests.map((request) => __awaiter(void 0, void 0, void 0, function* () {
        const offerCount = yield dealerRequest_model_1.DealerRequest.find({
            requestId: new mongoose_1.Types.ObjectId(request === null || request === void 0 ? void 0 : request._id),
        }).select("_id");
        return Object.assign(Object.assign({}, request.toObject()), { count: (offerCount === null || offerCount === void 0 ? void 0 : offerCount.length) || 0 });
    })));
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
};
