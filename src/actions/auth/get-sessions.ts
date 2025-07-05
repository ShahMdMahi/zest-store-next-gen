"use server";

import { auth } from "@/auth";
import { logger } from "@/lib/logger";
import { getJwtSessions } from "@/lib/jwt-session-store";
import { parseUserAgent } from "@/lib/user-agent-parser";

export type UserSession = {
  id: string;
  createdAt: Date;
  lastUsed: Date;
  deviceInfo?: {
    browser?: string;
    browserVersion?: string;
    os?: string;
    osVersion?: string;
    device?: string;
    isDesktop?: boolean;
    isMobile?: boolean;
    isTablet?: boolean;
    ipAddress?: string;
    location?: string;
  };
  isCurrentSession: boolean;
  isRevoked?: boolean;
};

/**
 * Retrieves all active sessions for the current user
 */
export async function getUserSessions(): Promise<{
  sessions: UserSession[];
  error?: string;
  debug?: {
    sessionCount?: number;
    currentSessionId?: string;
    error?: string;
  };
}> {
  try {
    // Get the current user's session
    const session = await auth();

    if (!session?.user?.id) {
      logger.warn("No user session found for getUserSessions");
      return {
        sessions: [],
        error: "Authentication required to view sessions",
      };
    }

    // Get the current session ID for comparison
    const currentSessionId = (session.user as { sessionToken?: string }).sessionToken;

    // Log for debugging
    logger.info(
      `Fetching sessions for user: ${session.user.id} with currentSessionId: ${currentSessionId}`
    );

    // Fetch all JWT sessions for this user using our custom implementation
    const jwtSessions = await getJwtSessions(session.user.id);

    // Log session count for debugging
    logger.info(`Found ${jwtSessions.length} sessions for user ${session.user.id}`);

    // Format the sessions for display
    const formattedSessions = jwtSessions.map(jwtSession => {
      // Parse browser info from user agent
      const deviceInfo = parseUserAgent(jwtSession.userAgent);

      // If we couldn't detect device info from user agent, use IP info instead
      const location = jwtSession.ipAddress ? `from ${jwtSession.ipAddress}` : "";

      return {
        id: jwtSession.id,
        createdAt: jwtSession.createdAt,
        lastUsed: jwtSession.lastUsedAt,
        deviceInfo: {
          browser: deviceInfo.browser,
          browserVersion: deviceInfo.browserVersion,
          os: deviceInfo.os,
          osVersion: deviceInfo.osVersion,
          device: deviceInfo.device,
          isDesktop: deviceInfo.isDesktop,
          isMobile: deviceInfo.isMobile,
          isTablet: deviceInfo.isTablet,
          ipAddress: jwtSession.ipAddress,
          location: location,
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
