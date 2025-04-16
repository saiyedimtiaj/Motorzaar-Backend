"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ListingSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    requestId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Request", required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    mileage: { type: String, required: true },
    fuel: { type: String, required: true },
    transmission: { type: String, required: true },
    color: { type: String, required: true },
    engineSize: { type: String, required: true },
    registration: { type: String, required: true },
    regDate: { type: String, required: true },
    owners: { type: String, required: true },
    motExpiry: { type: String, required: true },
    vatStatus: { type: String, required: true },
    additionalDetails: { type: String },
    auctionHouse: { type: String, required: true },
    auctionDate: { type: String, required: true },
    allInPrice: { type: String, required: true },
    images: { type: [String], required: true },
    additionalDealerDetails: { type: String },
    carCondition: { type: String, required: true },
    dealerUrl: { type: String, required: true },
    status: { type: String, required: true, default: "Pending" },
}, { timestamps: true });
const Listing = (0, mongoose_1.model)("Listing", ListingSchema);
exports.default = Listing;
