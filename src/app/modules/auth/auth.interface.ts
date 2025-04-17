export type TUser = {
  fullName: string;
  email: string;
  role: string;
  password: string;
  phone?: string;
  website?: string;
  avater?: string;
  createdAt?: Date;
  addressline1?: string;
  addressline2?: string;
  town?: string;
  country?: string;
  postcode?: string;

  businessType?: string;
  companyRegNumber?: string;
  fcaRegNumber?: string;
  vatNumber?: string;
  yearEstablished?: string;

  trustPilotUrl?: string;
  googleReviewsUrl?: string;

  primaryFirstName?: string;
  primaryLastName?: string;
  primaryRole?: string;
  primaryPhone?: string;

  secondaryFirstName?: string;
  secondaryLastName?: string;
  secondaryRole?: string;
  secondaryEmail?: string;
  secondaryPhone?: string;

  weekdayStart?: string;
  weekdayEnd?: string;
  saturdayStart?: string;
  saturdayEnd?: string;
  sundayStart?: string;
  sundayEnd?: string;
};

export type TLogin = {
  email: string;
  password: string;
};

export const USER_ROLE = {
  admin: "admin",
  user: "user",
  dealer: "dealer",
} as const;
