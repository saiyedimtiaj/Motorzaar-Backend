import { Router } from "express";
import { authRouter } from "../modules/auth/auth.route";
import { requestRoute } from "../modules/request/request.route";
import { listingRoute } from "../modules/listing/listing.route";
import { emailRoute } from "../modules/email/email.route";
import { dealerRequestRoute } from "../modules/dealerRequest/dealerRequest.route";

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
  {
    path: "/listing",
    route: listingRoute,
  },
  {
    path: "/email",
    route: emailRoute,
  },
  {
    path: "/dealer-request",
    route: dealerRequestRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
