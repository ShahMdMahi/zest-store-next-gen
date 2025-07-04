"use server";

import sendMail from "@/lib/nodemailer";
import { render } from "@react-email/render";
import { AccountVerificationEmail } from "@/lib/email-templates";
import { logger } from "@/lib/logger";

const SUBJECT = "Account Verification - Zest Store";
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const sendAccountVerificationEmail = async (
  to: string,
  username: string,
  verificationToken: string,
  expiryTime: string
) => {
  try {
    const verificationLink = `${BASE_URL}/auth/verify?token=${verificationToken}`;
    const emailContent = await render(
      AccountVerificationEmail({
        username,
        verificationLink,
        expiryTime,
      })
    );
    const info = await sendMail(to, SUBJECT, emailContent);
  } catch (error) {
    logger.error("Error sending account verification email:", error as Error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

export default sendAccountVerificationEmail;
