"use server";

import { auth } from "@/auth";
import { logger } from "@/lib/logger";
import {
  revokeJwtSession,
  revokeAllOtherJwtSessions,
} from "@/lib/jwt-session-store";

/**
 * Types for session revocation responses
 */
export type SessionRevocationResult = {
  success: boolean;
  message: string;
};

/**
 * Revokes a specific JWT session by its ID
 * @param sessionId The ID of the session to revoke
 */
export async function revokeSession(
  sessionId: string,
): Promise<SessionRevocationResult> {
  try {
    // Get the current user's session
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Authentication required to revoke sessions",
      };
    }

    // Revoke the specific JWT session using our custom implementation
    const success = await revokeJwtSession(sessionId, session.user.id);

    if (success) {
      logger.info(`JWT session revoked: ${sessionId}`, {
        userId: session.user.id,
        sessionId,
      });

      return {
        success: true,
        message: "Session successfully revoked",
      };
    } else {
      return {
        success: false,
        message:
          "Failed to revoke session - session may not exist or may not belong to you",
      };
    }
  } catch (error) {
    logger.error("Error revoking JWT session:", error as Error);

    return {
      success: false,
      message: "Failed to revoke session",
    };
  }
}

/**
 * Revokes all JWT sessions except the current one
 */
export async function revokeAllOtherSessions(): Promise<SessionRevocationResult> {
  try {
    // Get the current user's session
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Authentication required to revoke sessions",
      };
    }

    // Get the current session ID
    const currentSessionId = (session.user as { sessionToken?: string })
      .sessionToken;

    if (!currentSessionId) {
      return {
        success: false,
        message: "Could not identify current session",
      };
    }

    // Revoke all other JWT sessions using our custom implementation
    const count = await revokeAllOtherJwtSessions(
      currentSessionId,
      session.user.id,
    );

    logger.info(`All other JWT sessions revoked for user: ${session.user.id}`, {
      userId: session.user.id,
      count,
    });

    return {
      success: true,
      message: `${count} session${count === 1 ? "" : "s"} successfully revoked`,
    };
  } catch (error) {
    logger.error("Error revoking all JWT sessions:", error as Error);

    return {
      success: false,
      message: "Failed to revoke sessions",
    };
  }
}
