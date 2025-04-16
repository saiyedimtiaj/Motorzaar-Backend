"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoute = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const payment_controller_1 = require("./payment.controller");
const route = (0, express_1.Router)();
route.get("/initial-payment/:id", (0, auth_1.default)("user"), payment_controller_1.paymentController.initialPaymentDetails);
route.post("/payment-intent", (0, auth_1.default)("user"), payment_controller_1.paymentController.paymentIntent);
route.post("/confirm", (0, auth_1.default)("user"), payment_controller_1.paymentController.confirmPayment);
exports.paymentRoute = route;
