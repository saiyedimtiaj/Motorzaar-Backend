import { Router } from "express";
import auth from "../../middlewares/auth";
import { listingController } from "./listing.controller";
import { cloudUpload } from "../../config/cloudinary.config";

const route = Router();

route.post(
  "/create",
  auth("admin"),
  cloudUpload.array("images"),
  listingController.createNewListing
);
route.patch(
  "/edit/:id",
  auth("admin"),
  cloudUpload.array("images"),
  listingController.updateListing
);

route.get(
  "/getby-requestId/:id",
  auth("admin"),
  listingController.getListingByRequestId
);

route.patch(
  "/update-status/:id",
  auth("admin"),
  listingController.preApproveListingStatusUpdate
);

route.get(
  "/offer-listing",
  auth("dealer"),
  listingController.dealerOfferRequest
);

route.get("/", auth("user"), listingController.getUserListing);
route.get(
  "/listing-offer/:id",
  auth("user"),
  listingController.getListingOffers
);

route.get(
  "/pre-approval",
  auth("admin"),
  listingController.getPreApprovalListing
);

export const listingRoute = route;
