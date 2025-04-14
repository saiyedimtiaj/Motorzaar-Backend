"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const multer_config_1 = require("../../config/multer.config");
const route = (0, express_1.Router)();
route.post("/signup", auth_controller_1.userController.createUser);
route.post("/activate-account", auth_controller_1.userController.activateUser);
route.post("/signin", auth_controller_1.userController.loginUser);
route.post("/refresh-token", auth_controller_1.userController.refreshToken);
route.post("/reset-password", auth_controller_1.userController.resetPassword);
route.post("/change-password", auth_controller_1.userController.changePassword);
route.get("/current-user", (0, auth_1.default)("user", "admin", "dealer"), auth_controller_1.userController.getCurrentUser);
route.put("/update-profile", (0, auth_1.default)("user", "admin", "dealer"), multer_config_1.multerUpload.single("image"), auth_controller_1.userController.updateUser);
exports.authRouter = route;
