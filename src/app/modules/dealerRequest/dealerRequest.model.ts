// models/dealerRequest.model.ts
import { Schema, model } from "mongoose";
import { TDealerRequest } from "./dealerRequest.interface";

const dealerRequestSchema = new Schema<TDealerRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    dealerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    listingId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Listing",
    },
    requestId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Request",
    },
    status: {
      type: String,
      required: true,
      default: "pending",
    },
    allInPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const DealerRequest = model<TDealerRequest>(
  "DealerRequest",
  dealerRequestSchema
);
