"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoute = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const dashboard_controller_1 = require("./dashboard.controller");
const route = (0, express_1.Router)();
route.get("/user", (0, auth_1.default)("user"), dashboard_controller_1.dashboardController.getUserDashboardData);
route.get("/admin", (0, auth_1.default)("admin"), dashboard_controller_1.dashboardController.getAdminDashboardData);
route.get("/dealer", (0, auth_1.default)("dealer"), dashboard_controller_1.dashboardController.getDealerDashboardData);
exports.dashboardRoute = route;
