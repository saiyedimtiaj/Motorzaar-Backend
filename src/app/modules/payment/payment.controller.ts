/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { DealerRequest } from "../dealerRequest/dealerRequest.model";
import config from "../../config";
import Stripe from "stripe";
import Payment from "./payment.model";
import mongoose from "mongoose";
import { AppError } from "../../errors/AppError";

const stripe = new Stripe(config.stripe_secret!);

const initialPaymentDetails = catchAsync(async (req, res) => {
  const result = await DealerRequest.findById(req.params?.id)
    .populate("listingId", "_id make model year mileage images")
    .select("_id listingId allInPrice status");
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "retrive payment details successfully",
  });
});

const paymentIntent = catchAsync(async (req, res) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "EUR",
    payment_method_types: ["card"],
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Stripe intent retrive successful!",
    data: myPayment.client_secret,
  });
});

const confirmPayment = catchAsync(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const listing = await DealerRequest.findByIdAndUpdate(
      req.body?.listingId,
      {
        status: "Offer Accepted",
      },
      {
        new: true,
        session,
      }
    );

    if (!listing) {
      throw new AppError(httpStatus.NOT_FOUND, "Dealer request not found");
    }

    const payment = await Payment.create(
      [
        {
          dealerId: listing.dealerId,
          dealerRequestId: listing._id,
          listingId: listing.listingId,
          paymentId: req.body?.paymentId,
          requestId: listing.requestId,
          userId: req.user?._id,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return sendResponse(res, {
      data: payment[0],
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment successful and offer accepted.",
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Payment failed: ${error.message || "Something went wrong."}`
    );
  }
});

export const paymentController = {
  initialPaymentDetails,
  paymentIntent,
  confirmPayment,
};
