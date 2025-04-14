import { Router } from "express";
import { requestController } from "./request.controller";
import auth from "../../middlewares/auth";

const route = Router();

route.post("/create", auth("user"), requestController.createRequest);
route.get("/", requestController.getAllRequest);

export const requestRoute = route;
