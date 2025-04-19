import { v2 as cloudinary } from "cloudinary";
import config from "../config/index";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.cloud_api_key,
  api_secret: config.cloud_api_secret,
});

const cloudinaryUpload = cloudinary;

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
});

export const cloudUpload = multer({ storage });
