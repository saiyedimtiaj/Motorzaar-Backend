"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailRoute = void 0;
const express_1 = require("express");
const email_controller_1 = require("./email.controller");
const router = (0, express_1.Router)();
router.post("/send", email_controller_1.contactSendEmail);
exports.emailRoute = router;
