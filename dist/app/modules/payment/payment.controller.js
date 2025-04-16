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
exports.paymentController = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const dealerRequest_model_1 = require("../dealerRequest/dealerRequest.model");
const config_1 = __importDefault(require("../../config"));
const stripe_1 = __importDefault(require("stripe"));
const payment_model_1 = __importDefault(require("./payment.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = require("../../errors/AppError");
const stripe = new stripe_1.default(config_1.default.stripe_secret);
const initialPaymentDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield dealerRequest_model_1.DealerRequest.findById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id)
        .populate("listingId", "_id make model year mileage images")
        .select("_id listingId allInPrice status");
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: http_status_1.default.OK,
        message: "retrive payment details successfully",
    });
}));
const paymentIntent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const myPayment = yield stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "EUR",
        payment_method_types: ["card"],
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Stripe intent retrive successful!",
        data: myPayment.client_secret,
    });
}));
const confirmPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const listing = yield dealerRequest_model_1.DealerRequest.findByIdAndUpdate((_a = req.body) === null || _a === void 0 ? void 0 : _a.listingId, {
            status: "Offer Accepted",
        }, {
            new: true,
            session,
        });
        if (!listing) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Dealer request not found");
        }
        const payment = yield payment_model_1.default.create([
            {
                dealerId: listing.dealerId,
                dealerRequestId: listing._id,
                listingId: listing.listingId,
                paymentId: (_b = req.body) === null || _b === void 0 ? void 0 : _b.paymentId,
                requestId: listing.requestId,
                userId: (_c = req.user) === null || _c === void 0 ? void 0 : _c._id,
            },
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        return (0, sendResponse_1.default)(res, {
            data: payment[0],
            success: true,
            statusCode: http_status_1.default.OK,
            message: "Payment successful and offer accepted.",
        });
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Payment failed: ${error.message || "Something went wrong."}`);
    }
}));
exports.paymentController = {
    initialPaymentDetails,
    paymentIntent,
    confirmPayment,
};
