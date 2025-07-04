"use server";

import sendMail from "@/lib/nodemailer";
import { render } from "@react-email/render";
import { ResetPasswordEmail } from "@/lib/email-templates";

const SUBJECT = "Reset Your Password - Zest Store";
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const sendResetPasswordEmail = async (
  to: string,
  username: string,
  resetToken: string,
  expiryTime: string
) => {
  try {
    const resetLink = `${BASE_URL}/auth/reset-password?token=${resetToken}`;
    const emailContent = await render(
      ResetPasswordEmail({
        username,
        resetLink,
        expiryTime,
      })
    );
    const info = await sendMail(to, SUBJECT, emailContent);
    return info;
  } catch (error) {
    console.error("Error sending reset password email:", error);
  }
};

export default sendResetPasswordEmail;
