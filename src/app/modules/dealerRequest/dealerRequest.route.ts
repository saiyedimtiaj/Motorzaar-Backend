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

export const dealerRequestRoute = route;
