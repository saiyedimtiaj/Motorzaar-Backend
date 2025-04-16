"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    dealerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    requestId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Request",
        required: true,
    },
    dealerRequestId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "DealerRequest",
        required: true,
    },
    listingId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Listing",
        required: true,
    },
    paymentId: {
        type: String,
        required: true,
        unique: true,
    },
}, { timestamps: true });
const Payment = (0, mongoose_1.model)("Payment", paymentSchema);
exports.default = Payment;
