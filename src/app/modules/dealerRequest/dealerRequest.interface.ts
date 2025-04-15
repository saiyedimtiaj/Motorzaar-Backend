import { Types } from "mongoose";

export type TDealerRequest = {
  userId: Types.ObjectId;
  dealerId: Types.ObjectId;
  listingId: Types.ObjectId;
  requestId: Types.ObjectId;
  status: string;
  allInPrice: number;
};
