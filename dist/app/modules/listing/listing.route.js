"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listingRoute = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const multer_config_1 = require("../../config/multer.config");
const listing_controller_1 = require("./listing.controller");
const route = (0, express_1.Router)();
route.post("/create", (0, auth_1.default)("admin"), multer_config_1.multerUpload.array("images"), listing_controller_1.listingController.createNewListing);
route.get("/getby-requestId/:id", (0, auth_1.default)("admin"), listing_controller_1.listingController.getListingByRequestId);
route.patch("/update-status/:id", (0, auth_1.default)("admin"), listing_controller_1.listingController.approveListing);
route.get("/offer-listing", (0, auth_1.default)("dealer"), listing_controller_1.listingController.dealerOfferRequest);
route.get("/", (0, auth_1.default)("user"), listing_controller_1.listingController.getUserListing);
route.get("/listing-offer/:id", (0, auth_1.default)("user"), listing_controller_1.listingController.getListingOffers);
exports.listingRoute = route;
