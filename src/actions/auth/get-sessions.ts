"use server";

import { auth } from "@/auth";
import { logger } from "@/lib/logger";
import { getJwtSessions } from "@/lib/jwt-session-store";

export type UserSession = {
  id: string;
  createdAt: Date;
  lastUsed: Date;
  deviceInfo?: {
    browser?: string;
    os?: string;
    device?: string;
  };
  isCurrentSession: boolean;
};

/**
 * Retrieves all active sessions for the current user
 */
export async function getUserSessions(): Promise<{
  sessions: UserSession[];
  error?: string;
}> {
  try {
    // Get the current user's session
    const session = await auth();

    if (!session?.user?.id) {
      return {
        sessions: [],
        error: "Authentication required to view sessions",
      };
    }

    // Get the current session ID for comparison
    const currentSessionId = (session.user as { sessionToken?: string }).sessionToken;

    // Fetch all JWT sessions for this user using our custom implementation
    const jwtSessions = await getJwtSessions(session.user.id);

    // Format the sessions for display
    const formattedSessions = jwtSessions.map(jwtSession => {
      // Parse browser info from user agent
      let browser = "Unknown";
      let os = "Unknown";
      let device = "Unknown";

      if (jwtSession.userAgent) {
        // Simple user agent parsing
        if (jwtSession.userAgent.includes("Firefox")) browser = "Firefox";
        else if (jwtSession.userAgent.includes("Chrome")) browser = "Chrome";
        else if (jwtSession.userAgent.includes("Safari")) browser = "Safari";
        else if (jwtSession.userAgent.includes("Edge")) browser = "Edge";

        if (jwtSession.userAgent.includes("Windows")) os = "Windows";
        else if (jwtSession.userAgent.includes("Mac")) os = "MacOS";
        else if (jwtSession.userAgent.includes("Linux")) os = "Linux";
        else if (jwtSession.userAgent.includes("Android")) os = "Android";
        else if (jwtSession.userAgent.includes("iPhone") || jwtSession.userAgent.includes("iPad"))
          os = "iOS";

        if (jwtSession.userAgent.includes("Mobile")) device = "Mobile";
        else if (jwtSession.userAgent.includes("Tablet")) device = "Tablet";
        else device = "Desktop";
      }

      return {
        id: jwtSession.id,
        createdAt: jwtSession.createdAt,
        lastUsed: jwtSession.lastUsedAt,
        deviceInfo: {
          browser,
          os,
          device,
        },
        isCurrentSession: currentSessionId === jwtSession.id,
        isRevoked: jwtSession.isRevoked,
      };
    });

    // Filter out revoked sessions (we could show them with a revoked status if preferred)
    const activeSessions = formattedSessions.filter(session => !session.isRevoked);

    return {
      sessions: activeSessions,
    };
  } catch (error) {
    logger.error("Error fetching JWT sessions:", error as Error);

    return {
      sessions: [],
      error: "Failed to retrieve active sessions",
    };
  }
}
