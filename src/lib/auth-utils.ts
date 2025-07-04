import { User } from "@prisma/client";
import { logger } from "@/lib/logger";
import { auth } from "@/auth";
import crypto from "crypto";

/**
 * Authentication utility functions
 */

/**
 * Generate a secure random token for email verification or password reset
 */
export async function generateToken(length: number = 32): Promise<string> {
  return crypto.randomBytes(length).toString("hex");
}

/**
 * Validates if a user meets the required criteria
 */
export function validateUser(user: Partial<User>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Email validation - basic check
  if (user.email && !isValidEmail(user.email)) {
    errors.push("Invalid email format");
  }

  // Role validation
  if (user.role && !["USER", "ADMIN"].includes(user.role)) {
    errors.push("Invalid user role");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if current user has admin access
 */
export async function hasAdminAccess(): Promise<boolean> {
  try {
    const session = await auth();
    return session?.user?.role === "ADMIN";
  } catch (error) {
    logger.error("Error checking admin access", error as Error);
    return false;
  }
}

/**
 * Check if current user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const session = await auth();
    return !!session?.user;
  } catch (error) {
    logger.error("Error checking authentication", error as Error);
    return false;
  }
}

/**
 * Safely get current user ID
 */
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const session = await auth();
    return session?.user?.id || null;
  } catch (error) {
    logger.error("Error getting current user ID", error as Error);
    return null;
  }
}

/**
 * Handle authentication errors with appropriate responses
 */
export function handleAuthError(error: unknown): {
  message: string;
  status: number;
} {
  logger.error("Authentication error", error as Error);

  if (error instanceof Error) {
    if (error.name === "AuthenticationError") {
      return {
        message: "Authentication failed. Please login again.",
        status: 401,
      };
    }

    if (error.name === "AuthorizationError") {
      return {
        message: "You do not have permission to access this resource.",
        status: 403,
      };
    }
  }

  // Default error response
  return {
    message: "An unexpected error occurred during authentication.",
    status: 500,
  };
}
