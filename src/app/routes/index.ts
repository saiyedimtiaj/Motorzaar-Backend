import { Router } from "express";
import { authRouter } from "../modules/auth/auth.route";
import { requestRoute } from "../modules/request/request.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/request",
    route: requestRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
