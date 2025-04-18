"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dealerRequestRoute = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const dealerRequest_controller_1 = require("./dealerRequest.controller");
const route = (0, express_1.Router)();
route.post("/add-deposit", (0, auth_1.default)("dealer"), dealerRequest_controller_1.dealerRequestController.addDepositPaid);
route.get("/offered-requestby-listingId/:id", (0, auth_1.default)("dealer"), dealerRequest_controller_1.dealerRequestController.viewDepositDetails);
route.get("/details/:id", (0, auth_1.default)("dealer", "user", "admin"), dealerRequest_controller_1.dealerRequestController.dealerRequestDetails);
route.get("/customer-offer", (0, auth_1.default)("user"), dealerRequest_controller_1.dealerRequestController.customerOffers);
route.get("/submited-offer", (0, auth_1.default)("dealer"), dealerRequest_controller_1.dealerRequestController.getDealeSubmitedOffersListing);
route.post("/auction-status/:id", (0, auth_1.default)("dealer"), dealerRequest_controller_1.dealerRequestController.updateAuctionStatus);
route.get("/submited-price", (0, auth_1.default)("admin"), dealerRequest_controller_1.dealerRequestController.getSubmitedPrices);
route.get("/submited-price/:id", (0, auth_1.default)("admin"), dealerRequest_controller_1.dealerRequestController.getSubmitedPricesByRequestId);
exports.dealerRequestRoute = route;
