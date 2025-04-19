import { Router } from "express";
import auth from "../../middlewares/auth";
import { dashboardController } from "./dashboard.controller";

const route = Router();

route.get("/user", auth("user"), dashboardController.getUserDashboardData);
route.get("/admin", auth("admin"), dashboardController.getAdminDashboardData);
route.get(
  "/dealer",
  auth("dealer"),
  dashboardController.getDealerDashboardData
);

export const dashboardRoute = route;
