import { Types } from "mongoose";

export type TPayment = {
  userId: Types.ObjectId;
  dealerId: Types.ObjectId;
  requestId: Types.ObjectId;
  dealerRequestId: Types.ObjectId;
  listingId: Types.ObjectId;
  paymentId: string;
};
