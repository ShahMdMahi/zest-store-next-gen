"use server";

import { prisma } from "@/prisma";
import { logger } from "@/lib/logger";

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
    // Logic to resend verification email
    // This will require additional implementation for generating a new token
    // and sending the email
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
