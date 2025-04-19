"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const request_route_1 = require("../modules/request/request.route");
const listing_route_1 = require("../modules/listing/listing.route");
const email_route_1 = require("../modules/email/email.route");
const dealerRequest_route_1 = require("../modules/dealerRequest/dealerRequest.route");
const payment_route_1 = require("../modules/payment/payment.route");
const dashboard_route_1 = require("../modules/dashboard/dashboard.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.authRouter,
    },
    {
        path: "/request",
        route: request_route_1.requestRoute,
    },
    {
        path: "/listing",
        route: listing_route_1.listingRoute,
    },
    {
        path: "/email",
        route: email_route_1.emailRoute,
    },
    {
        path: "/dealer-request",
        route: dealerRequest_route_1.dealerRequestRoute,
    },
    {
        path: "/payment",
        route: payment_route_1.paymentRoute,
    },
    {
        path: "/dashboard",
        route: dashboard_route_1.dashboardRoute,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
