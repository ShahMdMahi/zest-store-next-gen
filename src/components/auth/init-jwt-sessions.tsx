// This file initializes JWT session management on app startup

import { initJwtSessionManagement } from "@/actions/auth";
import { logger } from "@/lib/logger";

export async function InitJwtSessions() {
  try {
    // Initialize JWT session management
    await initJwtSessionManagement();
    return null; // Component returns null (no UI)
  } catch (error) {
    logger.error("Error in InitJwtSessions component:", error as Error);
    return null;
  }
}
