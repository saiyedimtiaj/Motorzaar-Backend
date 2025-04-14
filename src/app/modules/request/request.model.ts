import { Schema, model } from "mongoose";
import { TRequest } from "./request.interface";

const requestSchema = new Schema<TRequest>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "Users" },
    make: { type: String, required: true },
    model: { type: String, required: true },
    budget: {
      type: [Number],
      required: true,
      validate: {
        validator: (val: number[]) => val.length === 2,
        message: "Budget must be a range of two numbers",
      },
    },
    yearRange: {
      type: [Number],
      required: true,
      validate: {
        validator: (val: number[]) => val.length === 2,
        message: "Year range must be a range of two numbers",
      },
    },
    fuelTypes: { type: [String], default: [] },
    maxMileage: { type: Number, default: null },
    maxMileageTouched: { type: Boolean, default: false },
    transmission: { type: [String], default: [] },
    carTypes: { type: [String], default: [] },
    preferredBrand: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
    preferredBrandMake: { type: String, default: "" },
    searchType: { type: String },
    budgetTouched: { type: Boolean, default: false },
    yearRangeTouched: { type: Boolean, default: false },
    hasPartExchange: { type: Boolean, required: true },
    partExchangeReg: { type: String, default: "" },
    status: { type: String, default: "new", required: true },
    timeline: [
      {
        status: { type: String, required: true },
        date: { type: Date, required: true },
        note: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Request = model<TRequest>("Request", requestSchema);
export default Request;
