"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    password: {
        type: String,
        required: true,
        minlength: [6, "Password must be at least 6 characters long"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    role: { type: String, required: true, default: "user" },
    phone: { type: String },
    website: { type: String },
    avater: { type: String },
    addressline1: { type: String },
    addressline2: { type: String },
    country: { type: String },
    postcode: { type: String },
    town: { type: String },
    businessType: { type: String },
    companyRegNumber: { type: String },
    fcaRegNumber: { type: String },
    vatNumber: { type: String },
    yearEstablished: { type: String },
    trustPilotUrl: { type: String },
    googleReviewsUrl: { type: String },
    primaryFirstName: { type: String },
    primaryLastName: { type: String },
    primaryPhone: { type: String },
    primaryRole: { type: String },
    secondaryEmail: { type: String },
    secondaryFirstName: { type: String },
    secondaryLastName: { type: String },
    secondaryPhone: { type: String },
    secondaryRole: { type: String },
    weekdayEnd: { type: String },
    weekdayStart: { type: String },
    saturdayStart: { type: String },
    sundayStart: { type: String },
    sundayEnd: { type: String },
}, {
    timestamps: true,
});
userSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    },
});
exports.Users = (0, mongoose_1.model)("Users", userSchema);
