import { Router } from "express";
import auth from "../../middlewares/auth";
import { multerUpload } from "../../config/multer.config";
import { listingController } from "./listing.controller";

const route = Router();

route.post(
  "/create",
  auth("admin"),
  multerUpload.array("images"),
  listingController.createNewListing
);

route.get(
  "/getby-requestId/:id",
  auth("admin"),
  listingController.getListingByRequestId
);

route.patch(
  "/update-status/:id",
  auth("admin"),
  listingController.approveListing
);

route.get(
  "/offer-listing",
  auth("dealer"),
  listingController.dealerOfferRequest
);

export const listingRoute = route;
