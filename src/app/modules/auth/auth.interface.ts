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
