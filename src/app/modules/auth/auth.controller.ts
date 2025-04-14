/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userServices } from "./auth.service";
import { Users } from "./auth.modal";
import config from "../../config";

const createUser = catchAsync(async (req, res) => {
  const result = await userServices.createUserIntoDb(req.body);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Create account sucessfully!",
  });
});

const activateUser = catchAsync(async (req, res) => {
  const result = await userServices.activateUser(req.body);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Sign up account successfully",
  });
});

const loginUser = catchAsync(async (req, res) => {
  const { data, accessToken, refreshToken } =
    await userServices.loginUserIntoDb(req.body);
  sendResponse(res, {
    data: { data, accessToken, refreshToken },
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged in successfully!",
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const refreshToken = req.headers["x-refresh-token"];
  const result = await userServices.refreshToken(refreshToken as string);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Access token retrive successfully!",
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await userServices.resetPassword(email);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Password reset instructions will be sent to your email!",
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { token, password } = req.body;
  const result = await userServices.changePassword(token, password);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "Password change sucessfully!",
  });
});

const getCurrentUser = catchAsync(async (req, res) => {
  const result = await Users.findById(req.user?._id);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "get user sucessfully!",
  });
});

const updateUser = catchAsync(async (req, res) => {
  let payload: Record<string, any> = {};
  if (req.file) {
    payload.avater = `${config.server_url}/${req.file.path}`;
  }
  if (req.body) {
    const parseData = JSON.parse(req.body.data);
    payload = {
      ...payload,
      fullName: parseData.name,
      phone: parseData.phone,
      address: parseData.address,
      website: parseData?.website,
    };
  }
  const result = await Users.findByIdAndUpdate(
    req.user?._id,
    { ...payload },
    {
      new: true,
    }
  );
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: httpStatus.OK,
    message: "update your information sucessfully!",
  });
});

export const userController = {
  createUser,
  loginUser,
  refreshToken,
  activateUser,
  changePassword,
  resetPassword,
  getCurrentUser,
  updateUser,
};
