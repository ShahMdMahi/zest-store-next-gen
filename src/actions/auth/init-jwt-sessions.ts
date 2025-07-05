"use server";

import { cleanupOldJwtSessions } from "@/lib/jwt-session-store";
import { logger } from "@/lib/logger";

/**
 * Initialize JWT session management
 * This should be called during app initialization
 * @param olderThanDays Number of days after which to clean up old sessions (default: 30)
 * @returns Object with status information
 */
export async function initJwtSessionManagement(olderThanDays: number = 30): Promise<{
  success: boolean;
  cleanedCount?: number;
  error?: string;
}> {
  try {
    // Clean up old/revoked JWT sessions
    const cleanedCount = await cleanupOldJwtSessions(olderThanDays);
    if (cleanedCount > 0) {
      logger.info(`Cleaned up ${cleanedCount} old JWT sessions`);
    }

    return {
      success: true,
      cleanedCount,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error("Error initializing JWT session management:", error as Error);
    return {
      success: false,
      error: errorMessage,
    };
  }
}
