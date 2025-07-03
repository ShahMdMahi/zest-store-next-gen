/**
 * Password utilities for securely handling user passwords
 */
import { hash, compare } from "bcryptjs";
import crypto from "crypto";
import { logger } from "./logger";

// Recommended cost factor for bcrypt (higher is more secure but slower)
const SALT_ROUNDS = 12;

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    return await hash(password, SALT_ROUNDS);
  } catch (error) {
    logger.error("Error hashing password", error as Error);
    throw new Error("Failed to hash password");
  }
}

/**
 * Compare a password with a hash
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  try {
    return await compare(password, hashedPassword);
  } catch (error) {
    logger.error("Error verifying password", error as Error);
    return false;
  }
}

/**
 * Generate a secure random token
 * Useful for password reset tokens, verification codes, etc.
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

/**
 * Validate password strength
 * Returns an object with validity and reasons
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];

  if (password.length < 8) {
    reasons.push("Password must be at least 8 characters");
  }

  if (!/[A-Z]/.test(password)) {
    reasons.push("Password must include at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    reasons.push("Password must include at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    reasons.push("Password must include at least one number");
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    reasons.push("Password must include at least one special character");
  }

  // Common password check could also be implemented here

  return {
    isValid: reasons.length === 0,
    reasons,
  };
}

/**
 * Generate a temporary password
 * Useful for password reset functionality
 */
export function generateTemporaryPassword(): string {
  const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lowercase = "abcdefghijkmnopqrstuvwxyz";
  const numbers = "23456789";
  const specials = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  let password = "";

  // Get one char from each category
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  password += specials.charAt(Math.floor(Math.random() * specials.length));

  // Add more random characters to reach length of 12
  const allChars = uppercase + lowercase + numbers + specials;
  for (let i = 0; i < 8; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  // Shuffle the password
  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
}
