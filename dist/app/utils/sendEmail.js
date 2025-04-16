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
exports.sendEmailFromDealer = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../config"));
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: config_1.default.node_env === "production",
    auth: {
        user: config_1.default.smtp_mail,
        pass: config_1.default.smtp_password,
    },
});
const sendEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, subject, template, data } = options;
    const templatePath = path_1.default.join(__dirname, "../mails", template);
    try {
        const html = yield ejs_1.default.renderFile(templatePath, data);
        const mailOption = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject,
            html,
        };
        yield transporter.sendMail(mailOption);
    }
    catch (error) {
        console.error("Error rendering email template or sending email:", error);
        throw error;
    }
});
const sendEmailFromDealer = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, subject, html } = options;
    try {
        const mailOptions = {
            from: email,
            to: process.env.SMTP_MAIL, // Your email to receive contact forms
            subject,
            html,
        };
        yield transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.error("Error sending email from dealer:", error);
        throw error;
    }
});
exports.sendEmailFromDealer = sendEmailFromDealer;
exports.default = sendEmail;
