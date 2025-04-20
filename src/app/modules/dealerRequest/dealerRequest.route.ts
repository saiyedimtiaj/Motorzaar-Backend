import { Router } from "express";
import auth from "../../middlewares/auth";
import { dealerRequestController } from "./dealerRequest.controller";

const route = Router();

route.post(
  "/add-deposit",
  auth("dealer"),
  dealerRequestController.addDepositPaid
);

route.get(
  "/offered-requestby-listingId/:id",
  auth("dealer"),
  dealerRequestController.viewDepositDetails
);

route.get(
  "/details/:id",
  auth("dealer", "user", "admin"),
  dealerRequestController.dealerRequestDetails
);

route.get(
  "/customer-offer",
  auth("user"),
  dealerRequestController.customerOffers
);

route.get(
  "/submited-offer",
  auth("dealer"),
  dealerRequestController.getDealeSubmitedOffersListing
);

route.post(
  "/auction-status/:id",
  auth("dealer"),
  dealerRequestController.updateAuctionStatus
);

route.get(
  "/submited-price",
  auth("admin"),
  dealerRequestController.getSubmitedPrices
);

route.get(
  "/submited-price/:id",
  auth("admin"),
  dealerRequestController.getSubmitedPricesByRequestId
);
route.post(
  "/offer-reject",
  auth("dealer"),
  dealerRequestController.rejectOffer
);

export const dealerRequestRoute = route;
