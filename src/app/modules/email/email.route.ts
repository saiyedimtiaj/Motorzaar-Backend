import { Router } from "express";
import { contactSendEmail } from "./email.controller";

const router = Router();
router.post("/send", contactSendEmail);

export const emailRoute = router;
