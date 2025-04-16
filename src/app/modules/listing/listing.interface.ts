import { Types } from "mongoose";

export type TListing = {
  userId: Types.ObjectId;
  requestId: Types.ObjectId;
  make: string;
  model: string;
  year: number;
  mileage: string;
  fuel: string;
  transmission: string;
  color: string;
  engineSize: string;
  registration: string;
  regDate: string; // ISO date string (e.g., "2020-06-15")
  owners: string;
  motExpiry: string; // ISO date string
  vatStatus: string;
  additionalDetails: string;
  auctionHouse: string;
  auctionDate: string; // ISO date string
  allInPrice: string; // or number
  images: string[]; // Array of image filenames or URLs
  additionalDealerDetails: string;
  carCondition: string;
  dealerUrl: string;
  status: string;
};
