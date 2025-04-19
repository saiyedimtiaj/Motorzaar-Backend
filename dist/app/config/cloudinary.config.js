"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudUpload = void 0;
const cloudinary_1 = require("cloudinary");
const index_1 = __importDefault(require("../config/index"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
cloudinary_1.v2.config({
    cloud_name: index_1.default.cloud_name,
    api_key: index_1.default.cloud_api_key,
    api_secret: index_1.default.cloud_api_secret,
});
const cloudinaryUpload = cloudinary_1.v2;
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinaryUpload,
});
exports.cloudUpload = (0, multer_1.default)({ storage });
