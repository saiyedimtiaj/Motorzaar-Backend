import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import config from "../config";

interface EmailOption {
  email: string;
  subject: string;
  template: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: { [key: string]: any };
  fromEmail?: string;
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: config.node_env === "production",
  auth: {
    user: config.smtp_mail,
    pass: config.smtp_password,
  },
});

const sendEmail = async (options: EmailOption): Promise<void> => {
  const { email, subject, template, data, fromEmail } = options;
  const templatePath = path.join(__dirname, "../mails", template);
  try {
    const html: string = await ejs.renderFile(templatePath, data);

    const mailOption = {
      from: fromEmail ? fromEmail : process.env.SMTP_MAIL,
      to: email,
      subject,
      html,
    };

    await transporter.sendMail(mailOption);
  } catch (error) {
    console.error("Error rendering email template or sending email:", error);
    throw error;
  }
};

export const sendEmailFromDealer = async (options: {
  email: string;
  subject: string;
  html: string;
}): Promise<void> => {
  const { email, subject, html } = options;
  try {
    const mailOptions = {
      from: email,
      to: process.env.SMTP_MAIL, // Your email to receive contact forms
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email from dealer:", error);
    throw error;
  }
};

export default sendEmail;
