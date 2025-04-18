import { Router } from "express";
import { contactSendEmail, sendEmailTodealer } from "./email.controller";

const router = Router();
router.post("/send", contactSendEmail);
router.post("/send-dealer", sendEmailTodealer);

export const emailRoute = router;
