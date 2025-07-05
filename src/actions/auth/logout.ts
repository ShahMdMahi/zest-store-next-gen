"use server";

import { auth, signOut } from "@/auth";
import { logger } from "@/lib/logger";
import { revokeJwtSession } from "@/lib/jwt-session-store";

export async function logout() {
  try {
    // Get the current session before signing out
    const session = await auth();
    const userId = session?.user?.id;
    const sessionId = (session?.user as { sessionToken?: string })?.sessionToken;

    // If we have a session ID and user ID, revoke the JWT session
    if (userId && sessionId) {
      await revokeJwtSession(sessionId, userId);
      logger.info(`Revoked JWT session ${sessionId} for user ${userId} during logout`);
    }

    // Perform the sign out
    await signOut({ redirectTo: "/auth/login" });
    logger.info("User logged out successfully");
    return { success: true, message: "Logged out successfully" };
  } catch (error) {
    logger.error("Logout error:", error as Error);
    return { success: false, error: "Failed to log out" };
  }
}
