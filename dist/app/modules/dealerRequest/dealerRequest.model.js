"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealerRequest = void 0;
// models/dealerRequest.model.ts
const mongoose_1 = require("mongoose");
const dealerRequestSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Users",
    },
    offerId: {
        type: String,
        required: true,
    },
    dealerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Users",
    },
    listingId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Listing",
    },
    requestId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Request",
    },
    status: {
        type: String,
        required: true,
        default: "pending",
    },
    allInPrice: {
        type: Number,
        required: true,
    },
    depositDate: {
        type: Date,
    },
}, {
    timestamps: true,
});
exports.DealerRequest = (0, mongoose_1.model)("DealerRequest", dealerRequestSchema);
