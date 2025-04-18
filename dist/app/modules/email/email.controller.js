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
exports.sendEmailTodealer = exports.contactSendEmail = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const email_model_1 = __importDefault(require("./email.model"));
const sendEmail_1 = __importStar(require("../../utils/sendEmail"));
exports.contactSendEmail = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { dealershipName, contactName, email, phone, message } = req.body;
    // Save email to database
    const savedEmail = yield email_model_1.default.create({
        dealershipName,
        contactName,
        email,
        phone,
        message,
    });
    // Send email to your inbox
    yield (0, sendEmail_1.sendEmailFromDealer)({
        email,
        subject: `Contact Inquiry from ${dealershipName} via Motozaar`,
        html: `
        <div>
          <p><strong>Dealership Name:</strong> ${dealershipName}</p>
          <p><strong>Contact Name:</strong> ${contactName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong><br/>${message}</p>
        </div>
      `,
    });
    // Send response
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: savedEmail,
        message: "Thank you for reaching out! Your message has been received. We'll get back to you within 24 hours.",
    });
}));
exports.sendEmailTodealer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    yield (0, sendEmail_1.default)({
        fromEmail: (_a = req.body) === null || _a === void 0 ? void 0 : _a.email,
        email: (_b = req.body) === null || _b === void 0 ? void 0 : _b.dealerEmail,
        subject: "Customer Inquiry from Motorzaar",
        template: "dealer-email.ejs",
        data: {
            fullName: (_c = req.body) === null || _c === void 0 ? void 0 : _c.firstName,
            phoneNumber: (_d = req.body) === null || _d === void 0 ? void 0 : _d.phone,
            message: (_e = req.body) === null || _e === void 0 ? void 0 : _e.message,
            email: (_f = req.body) === null || _f === void 0 ? void 0 : _f.email,
        },
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: [],
        message: "Your message has been successfully sent to the dealer. They will contact you shortly regarding your inquiry. Thank you for choosing Motorzaar!",
    });
}));
