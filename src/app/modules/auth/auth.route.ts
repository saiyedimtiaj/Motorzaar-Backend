import { Router } from "express";
import { userController } from "./auth.controller";
import auth from "../../middlewares/auth";
import { multerUpload } from "../../config/multer.config";
const route = Router();

route.post("/signup", userController.createUser);
route.post("/activate-account", userController.activateUser);
route.post("/signin", userController.loginUser);

route.post("/refresh-token", userController.refreshToken);

route.post("/reset-password", userController.resetPassword);
route.post("/change-password", userController.changePassword);

route.get(
  "/current-user",
  auth("user", "admin", "dealer"),
  userController.getCurrentUser
);

route.put(
  "/update-profile",
  auth("user", "admin", "dealer"),
  multerUpload.single("image"),
  userController.updateUser
);

route.get(
  "/dealer-profile/:id",
  auth("user", "admin", "dealer"),
  userController.getDealerProfile
);

export const authRouter = route;
