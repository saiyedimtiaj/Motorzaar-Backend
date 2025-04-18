import { model, Schema } from "mongoose";
import { TTimeline } from "./timeline.interface";

const timelineSchema = new Schema<TTimeline>({
  requestId: { type: Schema.Types.ObjectId, required: true, ref: "Request" },
  status: { type: String, required: true },
  date: { type: Date, required: true },
  note: { type: String, required: true },
});

const Timeline = model("Timeline", timelineSchema);
export default Timeline;
