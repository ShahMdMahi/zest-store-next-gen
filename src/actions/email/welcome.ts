"use server";

import sendMail from "@/lib/nodemailer";
import { render } from "@react-email/render";
import { WelcomeEmail } from "@/lib/email-templates";

const SUBJECT = "Welcome to Zest Store!";

const sendWelcomeEmail = async (to: string, name: string) => {
  try {
    const emailContent = await render(WelcomeEmail({ username: name, userEmail: to }));
    const info = await sendMail(to, SUBJECT, emailContent);
    return info;
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

export default sendWelcomeEmail;
