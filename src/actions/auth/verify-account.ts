"use server";

import { prisma } from "@/prisma";
import { logger } from "@/lib/logger";
import { generateToken } from "@/lib/auth-utils";

export type VerifyAccountState = {
  errors?: {
    _form?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function verifyAccount(token: string): Promise<VerifyAccountState> {
  try {
    if (!token) {
      return {
        errors: {
          _form: ["Invalid verification token"],
        },
        message: "Invalid verification token",
        success: false,
      };
    }

    // Find the user with this verification token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
      },
    });

    if (!user) {
      logger.warn("Account verification failed: user not found for token");
      return {
        errors: {
          _form: ["Invalid verification token"],
        },
        message: "Invalid verification token",
        success: false,
      };
    }

    // Check if the token has expired (if we've added this field to the schema)
    if (user.verificationTokenExpiry && new Date() > new Date(user.verificationTokenExpiry)) {
      logger.warn(`Account verification failed: token expired for user ${user.id}`);
      return {
        errors: {
          _form: ["Verification token has expired. Please request a new one."],
        },
        message: "Verification token has expired. Please request a new one.",
        success: false,
      };
    }

    // Update the user's status to verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });

    logger.info(`User ${user.id} email verified successfully`);

    return {
      message: "Email verified successfully! You can now log in.",
      success: true,
    };
  } catch (error) {
    logger.error("Account verification error:", error as Error);
    return {
      errors: {
        _form: ["An unexpected error occurred"],
      },
      message: "An unexpected error occurred. Please try again later.",
      success: false,
    };
  }
}

export async function resendVerificationEmail(email: string): Promise<VerifyAccountState> {
  try {
    if (!email) {
      return {
        errors: {
          _form: ["Email is required"],
        },
        message: "Email is required",
        success: false,
      };
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal that the user doesn't exist for security
      return {
        message: "If an account with this email exists, a verification link has been sent.",
        success: true,
      };
    }

    // If the email is already verified, no need to send a verification email
    if (user.emailVerified) {
      return {
        message: "Your email is already verified. You can log in to your account.",
        success: true,
      };
    }

    // Generate a new verification token
    const verificationToken = await generateToken();
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + 24); // Token valid for 24 hours

    // Update the user with the new verification token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationTokenExpiry: expiryTime,
      },
    });

    // Import here to avoid circular dependencies
    const sendAccountVerificationEmail = (await import("@/actions/email"))
      .sendAccountVerificationEmail;

    // Send the verification email
    await sendAccountVerificationEmail(email, user.name || "User", verificationToken, "24 hours");

    logger.info(`Verification email resent to user: ${user.id}`);

    return {
      message: "Verification email sent. Please check your inbox.",
      success: true,
    };
  } catch (error) {
    logger.error("Resend verification error:", error as Error);
    return {
      errors: {
        _form: ["An unexpected error occurred"],
      },
      message: "An unexpected error occurred. Please try again later.",
      success: false,
    };
  }
}
