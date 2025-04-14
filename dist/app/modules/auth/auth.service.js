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
exports.userServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const auth_modal_1 = require("./auth.modal");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../../errors/AppError");
const sendEmail_1 = __importDefault(require("../../utils/sendEmail"));
const createUserIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield auth_modal_1.Users.findOne({ email: payload.email });
    if (isExistUser) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "User already exist!");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload === null || payload === void 0 ? void 0 : payload.password, config_1.default.bcrypt_salt_round);
    const result = yield auth_modal_1.Users.create({
        password: hashedPassword,
        fullName: payload === null || payload === void 0 ? void 0 : payload.fullName,
        email: payload === null || payload === void 0 ? void 0 : payload.email,
        role: "user",
    });
    return result;
});
const activateUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, activateCode } = payload;
    const decoded = jsonwebtoken_1.default.decode(token);
    if (!decoded) {
        throw new AppError_1.AppError(http_status_1.default.NOT_ACCEPTABLE, "Your link has been expired");
    }
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
        throw new AppError_1.AppError(http_status_1.default.NOT_ACCEPTABLE, "Your code has been expired!");
    }
    if (decoded.activationCode !== activateCode) {
        throw new AppError_1.AppError(http_status_1.default.NOT_ACCEPTABLE, "Wrong activation code!");
    }
    const hashedPassword = yield bcrypt_1.default.hash(decoded === null || decoded === void 0 ? void 0 : decoded.password, config_1.default.bcrypt_salt_round);
    const result = yield auth_modal_1.Users.create({
        password: hashedPassword,
        fullName: decoded === null || decoded === void 0 ? void 0 : decoded.fullName,
        email: decoded === null || decoded === void 0 ? void 0 : decoded.email,
        role: "user",
    });
    return result;
});
const loginUserIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield auth_modal_1.Users.findOne({ email: payload.email }).select("+password");
    if (!isUserExist) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "User does not exist!");
    }
    const matchPassword = yield bcrypt_1.default.compare(payload.password, isUserExist.password);
    if (!matchPassword) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Invalid Password!");
    }
    const data = {
        email: isUserExist.email,
        role: isUserExist.role,
        fullName: isUserExist.fullName,
        _id: isUserExist._id,
    };
    const accessToken = jsonwebtoken_1.default.sign(data, config_1.default.jwt_access_secret, {
        expiresIn: config_1.default.jwt_secret_expirein,
    });
    const refreshToken = jsonwebtoken_1.default.sign(data, config_1.default.jwt_refresh_secret, {
        expiresIn: config_1.default.jwt_refresh_expires_in,
    });
    return { data: isUserExist, accessToken, refreshToken };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_refresh_secret);
    const { email, role, fullName, _id } = decoded;
    const isExistUser = yield auth_modal_1.Users.findOne({ email: email });
    if (!isExistUser) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "User does not exist!");
    }
    const jwtPayload = {
        email,
        role,
        fullName,
        _id,
    };
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, {
        expiresIn: config_1.default.jwt_secret_expirein,
    });
    return accessToken;
});
const resetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield auth_modal_1.Users.findOne({ email });
    if (!isUserExist) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "User does not exist!");
    }
    const token = jsonwebtoken_1.default.sign({
        email,
    }, config_1.default.jwt_activate_secret, {
        expiresIn: "15m",
    });
    const data = {
        confirmationLink: `${config_1.default.client_live_link}/change-password?confirmationLink=${token}`,
    };
    yield (0, sendEmail_1.default)({
        email: email,
        subject: "Change your Motorzaar account password",
        template: "reset-password.ejs",
        data: data,
    });
    return null;
});
const changePassword = (token, password) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = jsonwebtoken_1.default.decode(token);
    if (!decoded) {
        throw new AppError_1.AppError(http_status_1.default.NOT_ACCEPTABLE, "Invalid token");
    }
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
        throw new AppError_1.AppError(http_status_1.default.NOT_ACCEPTABLE, "Your token has been expired!");
    }
    const user = (yield jsonwebtoken_1.default.verify(token, config_1.default.jwt_activate_secret));
    const isUserExist = yield auth_modal_1.Users.findOne({ email: user === null || user === void 0 ? void 0 : user.email }).select("+password");
    if (!isUserExist) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "User does not exist!");
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, config_1.default.bcrypt_salt_round);
    const result = yield auth_modal_1.Users.findByIdAndUpdate(isUserExist._id, { password: hashedPassword }, {
        runValidators: true,
        new: true,
    });
    return result;
});
exports.userServices = {
    createUserIntoDb,
    loginUserIntoDb,
    refreshToken,
    activateUser,
    resetPassword,
    changePassword,
};
