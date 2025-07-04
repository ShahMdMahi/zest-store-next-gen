"use server";

import sendMail from "@/lib/nodemailer";
import { render } from "@react-email/render";
import { WelcomeEmail } from "@/lib/email-templates";
import { logger } from "@/lib/logger";

const SUBJECT = "Welcome to Zest Store!";

const sendWelcomeEmail = async (to: string, name: string) => {
  try {
    const emailContent = await render(WelcomeEmail({ username: name, userEmail: to }));
    const info = await sendMail(to, SUBJECT, emailContent);
    return info;
  } catch (error) {
    logger.error("Error sending welcome email:", error as Error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

export default sendWelcomeEmail;
