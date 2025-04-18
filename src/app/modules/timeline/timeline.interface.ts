import { Types } from "mongoose";

export type TTimeline = {
  requestId: Types.ObjectId;
  status: string;
  date: Date;
  note: string;
};
