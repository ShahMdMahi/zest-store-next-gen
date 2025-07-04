"use server";

import { prisma } from "@/prisma";
import { logger } from "@/lib/logger";
import { hashPassword } from "@/lib/password-utils";
import { generateToken } from "@/lib/auth-utils";
import { sendResetPasswordEmail } from "@/actions/email";
import { resetPasswordSchema, requestResetSchema } from "@/lib/validation-schemas";
import { RequestResetState, ResetPasswordState } from "@/lib/form-types";

export type { RequestResetState, ResetPasswordState };

export async function requestPasswordReset(
  prevState: RequestResetState,
  formData: FormData
): Promise<RequestResetState> {
  try {
    // Extract and validate email
    const validatedFields = requestResetSchema.safeParse({
      email: formData.get("email"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Please enter a valid email address.",
        success: false,
      };
    }

    const { email } = validatedFields.data;

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // For security reasons, don't reveal if the email exists or not
    if (!user) {
      logger.info(`Password reset requested for non-existent email: ${email}`);
      return {
        message: "If an account exists with that email, a password reset link has been sent.",
        success: true,
      };
    }

    // Generate reset token
    const resetToken = await generateToken();
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 15); // Token valid for 15 minutes

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry: expiryTime,
      },
    });

    // Send password reset email
    await sendResetPasswordEmail(email, user.name || "User", resetToken, "15 minutes");

    logger.info(`Password reset email sent to: ${email}`);

    return {
      message: "Password reset link has been sent to your email.",
      success: true,
    };
  } catch (error) {
    logger.error("Password reset request error:", error as Error);

    return {
      errors: {
        _form: ["An unexpected error occurred"],
      },
      message: "An unexpected error occurred. Please try again later.",
      success: false,
    };
  }
}

export async function resetPassword(
  prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  try {
    // Extract and validate form data
    const validatedFields = resetPasswordSchema.safeParse({
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      token: formData.get("token"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Invalid form data. Please check the errors below.",
        success: false,
      };
    }

    const { password, token } = validatedFields.data;

    // Find user with this reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
      },
    });

    if (!user) {
      logger.warn("Password reset failed: user not found for token");
      return {
        errors: {
          _form: ["Invalid or expired password reset token."],
        },
        message: "Invalid or expired password reset token.",
        success: false,
      };
    }

    // Check if the token has expired
    if (user.resetTokenExpiry && new Date() > new Date(user.resetTokenExpiry)) {
      logger.warn(`Password reset failed: token expired for user ${user.id}`);
      return {
        errors: {
          _form: ["Password reset token has expired. Please request a new one."],
        },
        message: "Password reset token has expired. Please request a new one.",
        success: false,
      };
    }

    // Hash new password and update user
    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    logger.info(`Password reset successful for user ${user.id}`);

    return {
      message: "Password has been reset successfully! You can now log in with your new password.",
      success: true,
    };
  } catch (error) {
    logger.error("Password reset error:", error as Error);

    return {
      errors: {
        _form: ["An unexpected error occurred"],
      },
      message: "An unexpected error occurred. Please try again later.",
      success: false,
    };
  }
}
