"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    port: process.env.PORT,
    node_env: process.env.NODE_ENV,
    db_url: process.env.DB_URL,
    bcrypt_salt_round: Number(process.env.BCRYPT_SALT_ROUND),
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_secret_expirein: process.env.JWT_ACCESS_EXPIREIN,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIREIN,
    jwt_activate_secret: process.env.JWT_ACCESS_SECRET,
    smtp_mail: process.env.SMTP_Mail,
    smtp_password: process.env.SMTP_PASSWORD,
    client_live_link: process.env.CLIENT_LIVE_LINK,
    server_url: process.env.SERVER_URL,
    stripe_secret: process.env.STRIPE_SECRET_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloud_api_key: process.env.CLOUDINARY_API_KEY,
    cloud_api_secret: process.env.CLOUDINARY_API_SECRET,
};
