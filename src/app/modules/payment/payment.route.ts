import { Router } from "express";
import auth from "../../middlewares/auth";
import { paymentController } from "./payment.controller";

const route = Router();

route.get(
  "/initial-payment/:id",
  auth("user"),
  paymentController.initialPaymentDetails
);
route.post("/payment-intent", auth("user"), paymentController.paymentIntent);
route.post("/confirm", auth("user"), paymentController.confirmPayment);

export const paymentRoute = route;
