/**
 * Custom session store for JWT strategy
 *
 * Since Next Auth with JWT strategy doesn't store sessions in the database,
 * we need a custom solution to track and revoke sessions.
 */

import { prisma } from "@/prisma";
import { logger } from "@/lib/logger";

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

// We'll use a dedicated table for tracking JWT sessions
export async function setupJwtSessionTable() {
  // Check if the table exists
  try {
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'jwt_sessions'
      );
    `;

    // If table doesn't exist, create it
    if (!tableExists) {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS jwt_sessions (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
          last_used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
          user_agent TEXT,
          ip_address TEXT,
          is_revoked BOOLEAN NOT NULL DEFAULT FALSE
        );
      `;

      // Create an index on user_id for faster lookups
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS jwt_sessions_user_id_idx ON jwt_sessions(user_id);
      `;
    }
  } catch (error) {
    logger.error("Error setting up JWT session table:", error as Error);
  }
}

// Record a new JWT session
export async function recordJwtSession(
  sessionId: string,
  userId: string,
  userAgent?: string,
  ipAddress?: string
): Promise<void> {
  try {
    // Ensure userAgent and ipAddress are strings or null for SQL query
    const sanitizedUserAgent = userAgent || null;
    const sanitizedIpAddress = ipAddress || null;

    await prisma.$executeRaw`
      INSERT INTO jwt_sessions (id, user_id, user_agent, ip_address)
      VALUES (${sessionId}, ${userId}, ${sanitizedUserAgent}, ${sanitizedIpAddress})
      ON CONFLICT (id) DO UPDATE
      SET last_used_at = NOW();
    `;
  } catch (error) {
    logger.error("Error recording JWT session:", error as Error);
  }
}

// Update a JWT session's last used timestamp
export async function updateJwtSession(sessionId: string): Promise<void> {
  try {
    await prisma.$executeRaw`
      UPDATE jwt_sessions
      SET last_used_at = NOW()
      WHERE id = ${sessionId};
    `;
  } catch (error) {
    logger.error("Error updating JWT session:", error as Error);
  }
}

// Revoke a specific JWT session
export async function revokeJwtSession(sessionId: string, userId: string): Promise<boolean> {
  try {
    // Mark the session as revoked
    const result = await prisma.$executeRaw`
      UPDATE jwt_sessions
      SET is_revoked = TRUE
      WHERE id = ${sessionId}
      AND user_id = ${userId};
    `;

    return result > 0;
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
    const result = await prisma.$executeRaw`
      UPDATE jwt_sessions
      SET is_revoked = TRUE
      WHERE user_id = ${userId}
      AND id != ${currentSessionId};
    `;

    return Number(result);
  } catch (error) {
    logger.error("Error revoking other JWT sessions:", error as Error);
    return 0;
  }
}

// Get all JWT sessions for a user
export async function getJwtSessions(userId: string): Promise<JwtSession[]> {
  try {
    const sessions = await prisma.$queryRaw<JwtSession[]>`
      SELECT 
        id, 
        user_id as "userId", 
        created_at as "createdAt", 
        last_used_at as "lastUsedAt", 
        user_agent as "userAgent", 
        ip_address as "ipAddress", 
        is_revoked as "isRevoked"
      FROM jwt_sessions
      WHERE user_id = ${userId}
      ORDER BY last_used_at DESC;
    `;

    return sessions;
  } catch (error) {
    logger.error("Error getting JWT sessions:", error as Error);
    return [];
  }
}

// Check if a JWT session is revoked
export async function isJwtSessionRevoked(sessionId: string): Promise<boolean> {
  try {
    const result = await prisma.$queryRaw<{ is_revoked: boolean }[]>`
      SELECT is_revoked
      FROM jwt_sessions
      WHERE id = ${sessionId}
      LIMIT 1;
    `;

    return result.length > 0 && result[0].is_revoked;
  } catch (error) {
    logger.error("Error checking if JWT session is revoked:", error as Error);
    // Default to not revoked if we can't check
    return false;
  }
}

// Cleanup old sessions (can be run periodically)
export async function cleanupOldJwtSessions(olderThanDays: number = 30): Promise<number> {
  try {
    const result = await prisma.$executeRaw`
      DELETE FROM jwt_sessions
      WHERE last_used_at < NOW() - INTERVAL '${olderThanDays} days'
      AND is_revoked = TRUE;
    `;

    return Number(result);
  } catch (error) {
    logger.error("Error cleaning up old JWT sessions:", error as Error);
    return 0;
  }
}
