/**
 * Custom session store for JWT strategy
 *
 * Since Next Auth with JWT strategy doesn't store sessions in the database,
 * we need a custom solution to track and revoke sessions.
 */

import { prisma } from "@/prisma";
import { logger } from "@/lib/logger";
import { parseUserAgent } from "@/lib/user-agent-parser";

// Type declaration for EdgeRuntime in global context
declare global {
  var EdgeRuntime: string | undefined;
}

// Check if we're in an Edge runtime environment
const isEdgeRuntime = typeof globalThis.EdgeRuntime !== "undefined";

// Define the interface for our custom session tracking
export interface JwtSession {
  id: string; // Session identifier (partial hash of the JWT)
  userId: string; // User ID
  createdAt: Date; // Creation timestamp
  lastUsedAt: Date; // Last activity timestamp
  userAgent?: string; // Browser/device info
  ipAddress?: string; // IP address (optional)
  isRevoked: boolean; // Whether this session has been revoked
}

// Record a new JWT session
export async function recordJwtSession(
  sessionId: string,
  userId: string,
  userAgent?: string,
  ipAddress?: string
): Promise<void> {
  // Skip database operations in Edge runtime
  if (isEdgeRuntime) {
    logger.info(`[Edge] Would record JWT session: ${sessionId} for user: ${userId}`);
    return;
  }

  try {
    if (!sessionId || !userId) {
      logger.warn(`Cannot record JWT session: missing sessionId or userId`);
      return;
    }

    // Try to parse user agent to ensure it's valid
    if (userAgent) {
      const deviceInfo = parseUserAgent(userAgent);
      logger.debug(
        `Recording session for ${deviceInfo.browser} on ${deviceInfo.os} (${deviceInfo.device})`
      );
    } else {
      logger.debug(`Recording session with no user agent information`);
    }

    logger.info(`Recording JWT session: ${sessionId} for user: ${userId}`);

    // Use Prisma client methods for upsert operation
    await prisma.jwtSession.upsert({
      where: { id: sessionId },
      update: {
        lastUsedAt: new Date(),
        // Only update these if provided
        ...(userAgent && { userAgent }),
        ...(ipAddress && { ipAddress }),
      },
      create: {
        id: sessionId,
        userId,
        userAgent: userAgent || null,
        ipAddress: ipAddress || null,
        createdAt: new Date(),
        lastUsedAt: new Date(),
        isRevoked: false,
      },
    });

    logger.info(`Successfully recorded JWT session: ${sessionId}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Error recording JWT session: ${errorMessage}`, error as Error);
  }
}

// Update a JWT session's last used timestamp
export async function updateJwtSession(sessionId: string, userId?: string): Promise<void> {
  // Skip database operations in Edge runtime
  if (isEdgeRuntime) {
    logger.info(`[Edge] Would update JWT session timestamp: ${sessionId}`);
    return;
  }

  try {
    if (!sessionId) {
      logger.warn(`Cannot update JWT session: missing sessionId`);
      return;
    }

    // First check if the session exists
    const session = await prisma.jwtSession.findUnique({
      where: { id: sessionId },
      select: { userId: true },
    });

    if (session) {
      // Update existing session
      await prisma.jwtSession.update({
        where: { id: sessionId },
        data: { lastUsedAt: new Date() },
      });
    } else if (userId) {
      // Create a new session if we have userId
      await recordJwtSession(sessionId, userId);
    } else {
      logger.warn(
        `JWT session ${sessionId} not found and no userId provided, cannot create or update`
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Error updating JWT session: ${errorMessage}`, error as Error);
  }
}

// Revoke a specific JWT session
export async function revokeJwtSession(sessionId: string, userId: string): Promise<boolean> {
  try {
    // Mark the session as revoked
    const result = await prisma.jwtSession.updateMany({
      where: {
        id: sessionId,
        userId: userId,
      },
      data: {
        isRevoked: true,
      },
    });

    return result.count > 0;
  } catch (error) {
    logger.error("Error revoking JWT session:", error as Error);
    return false;
  }
}

// Revoke all JWT sessions for a user except the current one
export async function revokeAllOtherJwtSessions(
  currentSessionId: string,
  userId: string
): Promise<number> {
  try {
    // Mark all other sessions as revoked
    const result = await prisma.jwtSession.updateMany({
      where: {
        userId: userId,
        id: { not: currentSessionId },
      },
      data: {
        isRevoked: true,
      },
    });

    return result.count;
  } catch (error) {
    logger.error("Error revoking other JWT sessions:", error as Error);
    return 0;
  }
}

// Get all JWT sessions for a user
export async function getJwtSessions(userId: string): Promise<JwtSession[]> {
  try {
    logger.info(`Getting JWT sessions for user: ${userId}`);

    const sessions = await prisma.jwtSession.findMany({
      where: { userId },
      orderBy: { lastUsedAt: "desc" },
    });

    return sessions as JwtSession[];
  } catch (error) {
    logger.error("Error getting JWT sessions:", error as Error);
    return [];
  }
}

// Check if a JWT session is revoked
export async function isJwtSessionRevoked(sessionId: string): Promise<boolean> {
  // Skip database operations in Edge runtime
  if (isEdgeRuntime) {
    logger.info(`[Edge] Would check if JWT session is revoked: ${sessionId}`);
    return false; // Assume not revoked in Edge runtime
  }

  try {
    if (!sessionId) {
      logger.warn("Cannot check if JWT session is revoked: Session ID is empty");
      return false;
    }

    const session = await prisma.jwtSession.findUnique({
      where: { id: sessionId },
      select: { isRevoked: true },
    });

    if (!session) {
      logger.debug(`JWT session not found: ${sessionId}`);
    }

    return session?.isRevoked ?? false;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Error checking if JWT session is revoked: ${errorMessage}`, error as Error);
    // Default to not revoked if we can't check
    return false;
  }
}

// Cleanup old sessions (can be run periodically)
export async function cleanupOldJwtSessions(olderThanDays: number = 30): Promise<number> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const result = await prisma.jwtSession.deleteMany({
      where: {
        lastUsedAt: { lt: cutoffDate },
        isRevoked: true,
      },
    });

    return result.count;
  } catch (error) {
    logger.error("Error cleaning up old JWT sessions:", error as Error);
    return 0;
  }
}
