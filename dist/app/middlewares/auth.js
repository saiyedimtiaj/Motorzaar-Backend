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
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const config_1 = __importDefault(require("../config"));
const AppError_1 = require("../errors/AppError");
const auth_modal_1 = require("../modules/auth/auth.modal");
const verifyToken = (token, secret) => {
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        throw new AppError_1.AppError(401, "You are not authorized!");
    }
};
exports.verifyToken = verifyToken;
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers.authorization;
        if (!token) {
            throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "You have no access to this route");
        }
        // console.log("token", token);
        const decoded = (yield (0, exports.verifyToken)(token, config_1.default.jwt_access_secret));
        const { role, email } = decoded;
        const user = yield auth_modal_1.Users.findOne({ email });
        if (!user) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "This user is not found !");
        }
        if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
            throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "You do not have the required role to access this route");
        }
        req.user = decoded;
        next();
    }));
};
exports.default = auth;
