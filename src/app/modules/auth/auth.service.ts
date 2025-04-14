import httpStatus from "http-status";
import config from "../../config";
import { TLogin, TUser } from "./auth.interface";
import { Users } from "./auth.modal";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../errors/AppError";
import sendEmail from "../../utils/sendEmail";

const createUserIntoDb = async (payload: TUser) => {
  const isExistUser = await Users.findOne({ email: payload.email });
  if (isExistUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exist!");
  }

  const hashedPassword = await bcrypt.hash(
    payload?.password,
    config.bcrypt_salt_round
  );
  const result = await Users.create({
    password: hashedPassword,
    fullName: payload?.fullName,
    email: payload?.email,
    role: "user",
  });
  return result;
};

const activateUser = async (payload: {
  token: string;
  activateCode: string;
}) => {
  const { token, activateCode } = payload;

  const decoded = jwt.decode(token) as JwtPayload | null;

  if (!decoded) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "Your link has been expired");
  }

  const currentTime = Math.floor(Date.now() / 1000);
  if (decoded.exp && decoded.exp < currentTime) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Your code has been expired!"
    );
  }

  if (decoded.activationCode !== activateCode) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "Wrong activation code!");
  }

  const hashedPassword = await bcrypt.hash(
    decoded?.password,
    config.bcrypt_salt_round
  );
  const result = await Users.create({
    password: hashedPassword,
    fullName: decoded?.fullName,
    email: decoded?.email,
    role: "user",
  });
  return result;
};

const loginUserIntoDb = async (payload: TLogin) => {
  const isUserExist = await Users.findOne({ email: payload.email }).select(
    "+password"
  );
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist!");
  }
  const matchPassword = await bcrypt.compare(
    payload.password,
    isUserExist.password
  );
  if (!matchPassword) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid Password!");
  }
  const data = {
    email: isUserExist.email,
    role: isUserExist.role,
    fullName: isUserExist.fullName,
    _id: isUserExist._id,
  };
  const accessToken = jwt.sign(data, config.jwt_access_secret as string, {
    expiresIn: config.jwt_secret_expirein,
  });

  const refreshToken = jwt.sign(data, config.jwt_refresh_secret as string, {
    expiresIn: config.jwt_refresh_expires_in,
  });

  return { data: isUserExist, accessToken, refreshToken };
};

const refreshToken = async (token: string) => {
  const decoded = jwt.verify(token, config.jwt_refresh_secret as string);
  const { email, role, fullName, _id } = decoded as JwtPayload;
  const isExistUser = await Users.findOne({ email: email });
  if (!isExistUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist!");
  }
  const jwtPayload = {
    email,
    role,
    fullName,
    _id,
  };
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_secret_expirein,
  });
  return accessToken;
};

const resetPassword = async (email: string) => {
  const isUserExist = await Users.findOne({ email });
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist!");
  }
  const token = jwt.sign(
    {
      email,
    },
    config.jwt_activate_secret as string,
    {
      expiresIn: "15m",
    }
  );

  const data = {
    confirmationLink: `${config.client_live_link}/change-password?confirmationLink=${token}`,
  };

  await sendEmail({
    email: email,
    subject: "Change your Motorzaar account password",
    template: "reset-password.ejs",
    data: data,
  });
  return null;
};

const changePassword = async (token: string, password: string) => {
  const decoded = jwt.decode(token) as JwtPayload | null;

  if (!decoded) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "Invalid token");
  }

  const currentTime = Math.floor(Date.now() / 1000);
  if (decoded.exp && decoded.exp < currentTime) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Your token has been expired!"
    );
  }

  const user = (await jwt.verify(
    token,
    config.jwt_activate_secret!
  )) as JwtPayload;

  const isUserExist = await Users.findOne({ email: user?.email }).select(
    "+password"
  );
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist!");
  }

  const hashedPassword = await bcrypt.hash(password, config.bcrypt_salt_round);
  const result = await Users.findByIdAndUpdate(
    isUserExist._id,
    { password: hashedPassword },
    {
      runValidators: true,
      new: true,
    }
  );
  return result;
};

export const userServices = {
  createUserIntoDb,
  loginUserIntoDb,
  refreshToken,
  activateUser,
  resetPassword,
  changePassword,
};
