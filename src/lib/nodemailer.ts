import nodemailer from "nodemailer";
import { logger } from "@/lib/logger";

const host = process.env.EMAIL_SMTP_HOST!;
const port = parseInt(process.env.EMAIL_SMTP_PORT!, 10);
const secure = process.env.EMAIL_SMTP_SECURE === "true";
const user = process.env.EMAIL_SMTP_USER!;
const pass = process.env.EMAIL_SMTP_PASS!;
const fromName = process.env.EMAIL_SMTP_FROM_NAME || "Zest Store";
const fromEmail = process.env.EMAIL_SMTP_FROM_EMAIL || user;

const transporter = nodemailer.createTransport({
  host: host,
  port: port,
  secure: secure,
  from: `"${fromName}" <${fromEmail}>`,
  auth: {
    user: user,
    pass: pass,
  },
});

const sendMail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      html,
    });
    logger.info("Email sent", {
      to,
      subject,
      messageId: info.messageId,
      response: info.response,
    });
    return info;
  } catch (error) {
    logger.error("Error sending email:", error as Error);
  }
};

export default sendMail;
