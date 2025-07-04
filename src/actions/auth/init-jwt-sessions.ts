"use server";

import {
  setupJwtSessionTable,
  cleanupOldJwtSessions,
} from "@/lib/jwt-session-store";
import { logger } from "@/lib/logger";

/**
 * Initialize JWT session management
 * This should be called during app initialization
 */
export async function initJwtSessionManagement(): Promise<void> {
  try {
    // Set up the JWT session table if it doesn't exist
    await setupJwtSessionTable();

    // Clean up old/revoked JWT sessions
    const cleanedCount = await cleanupOldJwtSessions(30); // 30 days
    if (cleanedCount > 0) {
      logger.info(`Cleaned up ${cleanedCount} old JWT sessions`);
    }
  } catch (error) {
    logger.error("Error initializing JWT session management:", error as Error);
  }
}
