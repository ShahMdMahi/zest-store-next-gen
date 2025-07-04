"use server";

import { z } from "zod";
import { AuthError } from "next-auth";
import { prisma } from "@/prisma";
import { signIn } from "@/auth";
import { logger } from "@/lib/logger";
import { verifyPassword } from "@/lib/password-utils";
import {
  isAccountLocked,
  resetFailedLoginAttempts,
  recordFailedLoginAttempt,
  getCooldownTimeRemaining,
} from "@/lib/auth-security";

// Login validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormState = {
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function login(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  try {
    // Extract and validate form data
    const validatedFields = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Invalid form data. Please check the errors below.",
        success: false,
      };
    }

    const { email, password } = validatedFields.data;

    // Check if account is locked due to too many failed attempts
    const isLocked = await isAccountLocked(email);
    if (isLocked) {
      const cooldownSeconds = await getCooldownTimeRemaining(email);
      const minutes = Math.ceil(cooldownSeconds / 60);

      return {
        errors: {
          _form: [`Too many failed attempts. Please try again in ${minutes} minutes.`],
        },
        message: `Account temporarily locked. Try again in ${minutes} minutes.`,
        success: false,
      };
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      // Record failed login attempt
      await recordFailedLoginAttempt(email);

      // Don't reveal whether the user exists or not (security best practice)
      return {
        errors: {
          _form: ["Invalid email or password"],
        },
        message: "Invalid email or password",
        success: false,
      };
    }

    // Check if email has been verified
    if (!user.emailVerified) {
      logger.warn(`Login attempt for unverified email: ${email}`);
      return {
        errors: {
          _form: ["Please verify your email before logging in"],
        },
        message:
          "Please verify your email before logging in. Check your inbox for the verification link or request a new one.",
        success: false,
      };
    }

    // Verify the password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      // Record failed login attempt
      await recordFailedLoginAttempt(email);

      return {
        errors: {
          _form: ["Invalid email or password"],
        },
        message: "Invalid email or password",
        success: false,
      };
    }

    // Reset failed login attempts on successful login
    await resetFailedLoginAttempts(user.id);

    // Sign in the user
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    logger.info(`User logged in: ${user.id}`, { userId: user.id });

    return {
      message: "Login successful! You are now logged in.",
      success: true,
    };
  } catch (error) {
    logger.error("Login error:", error as Error);

    if (error instanceof AuthError) {
      // Handle next-auth specific errors
      switch (error.type) {
        case "CredentialsSignin":
          return {
            errors: {
              _form: ["Invalid email or password"],
            },
            message: "Invalid email or password",
            success: false,
          };
        default:
          return {
            errors: {
              _form: ["Authentication failed"],
            },
            message: "Authentication failed",
            success: false,
          };
      }
    }

    return {
      errors: {
        _form: ["An unexpected error occurred"],
      },
      message: "An unexpected error occurred. Please try again later.",
      success: false,
    };
  }
}
