import { prisma } from "@/prisma";
import { logger } from "./logger";

// Maximum allowed failed login attempts before enforcing a cooldown
const MAX_FAILED_ATTEMPTS = 5;

// Cooldown period in milliseconds (30 minutes)
const COOLDOWN_PERIOD_MS = 30 * 60 * 1000;

/**
 * Rate limiting and security utilities
 */

/**
 * Record a failed login attempt for a user
 * Returns true if the account is now locked (too many failed attempts)
 */
export async function recordFailedLoginAttempt(
  email: string,
): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, failedLogins: true, updatedAt: true },
    });

    if (!user) {
      // Don't expose whether a user exists or not
      return false;
    }

    // Calculate if the cooldown period has passed since last update
    const now = new Date();
    const lastUpdate = user.updatedAt;
    const timeSinceLastUpdate = now.getTime() - lastUpdate.getTime();

    // If cooldown period has passed, reset failed logins counter
    const failedLogins =
      timeSinceLastUpdate > COOLDOWN_PERIOD_MS
        ? 1 // Reset to 1 since this is a new failed attempt
        : user.failedLogins + 1;

    // Update the user's failed login counter
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLogins,
        updatedAt: now,
      },
    });

    // Return whether account should be temporarily locked
    return failedLogins >= MAX_FAILED_ATTEMPTS;
  } catch (error) {
    logger.error("Error recording failed login attempt", error as Error);
    return false;
  }
}

/**
 * Reset failed login attempts for a user (called after successful login)
 */
export async function resetFailedLoginAttempts(userId: string): Promise<void> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        failedLogins: 0,
        lastLogin: new Date(),
      },
    });
  } catch (error) {
    logger.error("Error resetting failed login attempts", error as Error, {
      userId,
    });
  }
}

/**
 * Check if a user account is temporarily locked due to too many failed attempts
 */
export async function isAccountLocked(email: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { failedLogins: true, updatedAt: true },
    });

    if (!user) {
      // Don't expose whether a user exists or not
      return false;
    }

    if (user.failedLogins < MAX_FAILED_ATTEMPTS) {
      return false;
    }

    // Check if the cooldown period has passed
    const now = new Date();
    const lastUpdate = user.updatedAt;
    const timeSinceLastUpdate = now.getTime() - lastUpdate.getTime();

    return timeSinceLastUpdate <= COOLDOWN_PERIOD_MS;
  } catch (error) {
    logger.error("Error checking if account is locked", error as Error);
    return false;
  }
}

/**
 * Get cooldown remaining time in seconds
 */
export async function getCooldownTimeRemaining(email: string): Promise<number> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { updatedAt: true },
    });

    if (!user) {
      return 0;
    }

    const now = new Date();
    const lastUpdate = user.updatedAt;
    const timeSinceLastUpdate = now.getTime() - lastUpdate.getTime();

    if (timeSinceLastUpdate >= COOLDOWN_PERIOD_MS) {
      return 0;
    }

    return Math.ceil((COOLDOWN_PERIOD_MS - timeSinceLastUpdate) / 1000);
  } catch (error) {
    logger.error("Error getting cooldown time", error as Error);
    return 0;
  }
}
