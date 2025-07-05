"use server";

import { auth } from "@/auth";
import { logger } from "@/lib/logger";
import { getJwtSessions } from "@/lib/jwt-session-store";
import { prisma } from "@/prisma";

import { JwtSession as PrismaJwtSession } from "@prisma/client";
import { JwtSession } from "@/lib/jwt-session-store";

export type DebugSessionsResult = {
  success: boolean;
  user?: string;
  sessionToken?: string;
  sessionsCount?: number;
  sessions?: JwtSession[];
  rawSessionsData?: PrismaJwtSession[];
  tableInfo?: { exists: boolean };
  error?: string;
};

/**
 * Debug server action to check JWT session status
 */
export async function debugSessions(): Promise<DebugSessionsResult> {
  try {
    const session = await auth();

    // Check authentication
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized - You must be logged in to view session information",
      };
    }

    // Get the sessions for the current user
    const jwtSessions = await getJwtSessions(session.user.id);

    // Get the raw session data using Prisma
    const rawSessionsData = await prisma.jwtSession.findMany({
      where: { userId: session.user.id },
    });

    // Check if the table exists by checking for table info in Prisma's metadata
    let tableInfo = { exists: false };
    try {
      // We can check if the table exists by trying to count records
      await prisma.jwtSession.count();
      tableInfo = { exists: true };
    } catch (error) {
      logger.error("Error checking JWT sessions table:", error as Error);
    }

    return {
      success: true,
      user: session.user.id,
      sessionToken: (session.user as { sessionToken?: string }).sessionToken,
      sessionsCount: jwtSessions.length,
      sessions: jwtSessions,
      rawSessionsData,
      tableInfo,
    };
  } catch (error) {
    logger.error("Debug sessions action error:", error as Error);
    return {
      success: false,
      error: "Failed to debug sessions",
    };
  }
}
