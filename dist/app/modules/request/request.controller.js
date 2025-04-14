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
exports.requestController = exports.getAllRequest = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const request_model_1 = __importDefault(require("./request.model"));
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
    const query = {};
    const { searchQuery, page = "1", limit = "10" } = req.query;
    // If there's a search query, search across multiple fields
    if (searchQuery) {
        const searchRegex = { $regex: searchQuery, $options: "i" };
        query.$or = [{ model: searchRegex }];
    }
    // Pagination
    const currentPage = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (currentPage - 1) * pageSize;
    // Count total documents
    const totalRequests = yield request_model_1.default.countDocuments(query);
    // Get paginated + populated results
    const requests = yield request_model_1.default.find(query)
        .populate("userId") // assuming RequestModel.user is a ref to User
        .skip(skip)
        .limit(pageSize)
        .exec();
    (0, sendResponse_1.default)(res, {
        data: requests,
        meta: {
            total: totalRequests,
            page: currentPage,
            limit: pageSize,
            totalPage: Math.ceil(totalRequests / pageSize),
        },
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Requests retrieved successfully!",
    });
}));
exports.requestController = {
    createRequest,
    getAllRequest: exports.getAllRequest,
};
