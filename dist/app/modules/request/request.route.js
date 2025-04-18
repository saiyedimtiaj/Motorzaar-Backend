"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestRoute = void 0;
const express_1 = require("express");
const request_controller_1 = require("./request.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const route = (0, express_1.Router)();
route.post("/create", (0, auth_1.default)("user"), request_controller_1.requestController.createRequest);
route.get("/", request_controller_1.requestController.getAllRequest);
route.get("/user-requests", (0, auth_1.default)("user"), request_controller_1.requestController.getAllCustomerRequest);
route.get("/timeline/:id", (0, auth_1.default)("admin"), request_controller_1.requestController.getAllTimeLine);
exports.requestRoute = route;
