"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const request_route_1 = require("../modules/request/request.route");
const listing_route_1 = require("../modules/listing/listing.route");
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
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
