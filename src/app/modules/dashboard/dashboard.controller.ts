import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import Request from "../request/request.model";
import { Types } from "mongoose";
import { DealerRequest } from "../dealerRequest/dealerRequest.model";
import { Users } from "../auth/auth.modal";

const getUserDashboardData = catchAsync(async (req, res) => {
  const userId = new Types.ObjectId(req.user?._id);

  const activeRequest = await Request.countDocuments({ userId });
  const dealerOffer = await DealerRequest.countDocuments({ userId });

  sendResponse(res, {
    data: { activeRequest, dealerOffer },
    success: true,
    statusCode: httpStatus.OK,
    message: "Dashboard information retrieved successfully!",
  });
});

const getAdminDashboardData = catchAsync(async (req, res) => {
  const totalUser = await Users.countDocuments({ role: "user" });
  const activeRequest = 0;

  sendResponse(res, {
    data: { totalUser, activeRequest },
    success: true,
    statusCode: httpStatus.OK,
    message: "Dashboard information retrieved successfully!",
  });
});

const getDealerDashboardData = catchAsync(async (req, res) => {
  const offers = 0;
  const activeRequest = 0;

  sendResponse(res, {
    data: { offers, activeRequest },
    success: true,
    statusCode: httpStatus.OK,
    message: "Dashboard information retrieved successfully!",
  });
});

export const dashboardController = {
  getUserDashboardData,
  getAdminDashboardData,
  getDealerDashboardData,
};
