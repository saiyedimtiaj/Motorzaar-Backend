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
exports.dashboardController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const request_model_1 = __importDefault(require("../request/request.model"));
const mongoose_1 = require("mongoose");
const dealerRequest_model_1 = require("../dealerRequest/dealerRequest.model");
const auth_modal_1 = require("../auth/auth.modal");
const getUserDashboardData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = new mongoose_1.Types.ObjectId((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
    const activeRequest = yield request_model_1.default.countDocuments({ userId });
    const dealerOffer = yield dealerRequest_model_1.DealerRequest.countDocuments({ userId });
    (0, sendResponse_1.default)(res, {
        data: { activeRequest, dealerOffer },
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Dashboard information retrieved successfully!",
    });
}));
const getAdminDashboardData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const totalUser = yield auth_modal_1.Users.countDocuments({ role: "user" });
    const activeRequest = 0;
    (0, sendResponse_1.default)(res, {
        data: { totalUser, activeRequest },
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Dashboard information retrieved successfully!",
    });
}));
const getDealerDashboardData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const offers = 0;
    const activeRequest = 0;
    (0, sendResponse_1.default)(res, {
        data: { offers, activeRequest },
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Dashboard information retrieved successfully!",
    });
}));
exports.dashboardController = {
    getUserDashboardData,
    getAdminDashboardData,
    getDealerDashboardData,
};
