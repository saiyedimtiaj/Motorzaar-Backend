import { model, Schema } from "mongoose";
import { TEmail } from "./email.interface";

const emailSchema = new Schema<TEmail>(
  {
    dealershipName: { type: String, required: true },
    contactName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Email = model("Email", emailSchema);
export default Email;
