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
exports.contactSendEmail = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const email_model_1 = __importDefault(require("./email.model"));
const sendEmail_1 = require("../../utils/sendEmail");
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
