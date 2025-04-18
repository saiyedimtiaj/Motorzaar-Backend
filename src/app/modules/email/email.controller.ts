import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import Email from "./email.model";
import sendEmail, { sendEmailFromDealer } from "../../utils/sendEmail";

export const contactSendEmail = catchAsync(async (req, res) => {
  const { dealershipName, contactName, email, phone, message } = req.body;

  // Save email to database
  const savedEmail = await Email.create({
    dealershipName,
    contactName,
    email,
    phone,
    message,
  });

  // Send email to your inbox
  await sendEmailFromDealer({
    email,
    subject: `Contact Inquiry from ${dealershipName} via Motozaar`,
    html: `
        <div>
          <p><strong>Dealership Name:</strong> ${dealershipName}</p>
          <p><strong>Contact Name:</strong> ${contactName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong><br/>${message}</p>
        </div>
      `,
  });

  // Send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: savedEmail,
    message:
      "Thank you for reaching out! Your message has been received. We'll get back to you within 24 hours.",
  });
});

export const sendEmailTodealer = catchAsync(async (req, res) => {
  await sendEmail({
    fromEmail: req.body?.email,
    email: req.body?.dealerEmail,
    subject: "Customer Inquiry from Motorzaar",
    template: "dealer-email.ejs",
    data: {
      fullName: req.body?.firstName,
      phoneNumber: req.body?.phone,
      message: req.body?.message,
      email: req.body?.email,
    },
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: [],
    message:
      "Your message has been successfully sent to the dealer. They will contact you shortly regarding your inquiry. Thank you for choosing Motorzaar!",
  });
});
