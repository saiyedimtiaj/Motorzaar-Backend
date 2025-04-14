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
exports.userController = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_service_1 = require("./auth.service");
const auth_modal_1 = require("./auth.modal");
const config_1 = __importDefault(require("../../config"));
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.userServices.createUserIntoDb(req.body);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Create account sucessfully!",
    });
}));
const activateUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.userServices.activateUser(req.body);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Sign up account successfully",
    });
}));
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, accessToken, refreshToken } = yield auth_service_1.userServices.loginUserIntoDb(req.body);
    (0, sendResponse_1.default)(res, {
        data: { data, accessToken, refreshToken },
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User logged in successfully!",
    });
}));
const refreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.headers["x-refresh-token"];
    const result = yield auth_service_1.userServices.refreshToken(refreshToken);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Access token retrive successfully!",
    });
}));
const resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const result = yield auth_service_1.userServices.resetPassword(email);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Password reset instructions will be sent to your email!",
    });
}));
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, password } = req.body;
    const result = yield auth_service_1.userServices.changePassword(token, password);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Password change sucessfully!",
    });
}));
const getCurrentUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield auth_modal_1.Users.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "get user sucessfully!",
    });
}));
const updateUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let payload = {};
    if (req.file) {
        payload.avater = `${config_1.default.server_url}/${req.file.path}`;
    }
    if (req.body) {
        const parseData = JSON.parse(req.body.data);
        payload = Object.assign(Object.assign({}, payload), { fullName: parseData.name, phone: parseData.phone, address: parseData.address, website: parseData === null || parseData === void 0 ? void 0 : parseData.website });
    }
    const result = yield auth_modal_1.Users.findByIdAndUpdate((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, Object.assign({}, payload), {
        new: true,
    });
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "update your information sucessfully!",
    });
}));
exports.userController = {
    createUser,
    loginUser,
    refreshToken,
    activateUser,
    changePassword,
    resetPassword,
    getCurrentUser,
    updateUser,
};
