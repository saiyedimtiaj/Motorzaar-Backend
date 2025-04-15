export type TUser = {
  fullName: string;
  email: string;
  role: string;
  password: string;
  phone?: string;
  address: string;
  website: string;
  avater: string;
  createdAt: Date;
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
