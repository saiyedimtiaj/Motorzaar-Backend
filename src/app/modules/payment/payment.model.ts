import { model, Schema } from "mongoose";
import { TPayment } from "./payment.interface";

const paymentSchema = new Schema<TPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    dealerId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    requestId: {
      type: Schema.Types.ObjectId,
      ref: "Request",
      required: true,
    },
    dealerRequestId: {
      type: Schema.Types.ObjectId,
      ref: "DealerRequest",
      required: true,
    },
    listingId: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Payment = model("Payment", paymentSchema);

export default Payment;
