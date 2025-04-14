import { Schema, model } from "mongoose";
import { TUser } from "./auth.interface";

const userSchema = new Schema<TUser>(
  {
    fullName: { type: String, required: true },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: { type: String, required: true, default: "user" },
    address: { type: String },
    phone: { type: String },
    website: { type: String },
    avater: { type: String },
  },
  {
    timestamps: true,
  }
);

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

export const Users = model<TUser>("Users", userSchema);
