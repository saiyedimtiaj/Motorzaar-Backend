import { Router } from "express";
import { requestController } from "./request.controller";
import auth from "../../middlewares/auth";

const route = Router();

route.post("/create", auth("user"), requestController.createRequest);
route.get("/", requestController.getAllRequest);
route.get(
  "/user-requests",
  auth("user"),
  requestController.getAllCustomerRequest
);

route.get("/timeline/:id", auth("admin"), requestController.getAllTimeLine);

export const requestRoute = route;
