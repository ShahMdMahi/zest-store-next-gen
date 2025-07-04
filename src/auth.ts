import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import authConfig from "@/auth.config";
import { prisma } from "@/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Role } from "@prisma/client";
import { logger } from "@/lib/logger";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import { recordJwtSession, updateJwtSession, isJwtSessionRevoked } from "@/lib/jwt-session-store";

// Error handling class for authentication issues
class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

declare module "next-auth" {
  /**
   * Extended User interface for Session
   */
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      emailVerified?: Date | null;
      image?: string | null;
      role: Role;
      createdAt: Date;
      updatedAt: Date;
      /**
       * Time when the session was last validated
       */
      sessionLastValidated?: number;
      /**
       * Current session token
       */
      sessionToken?: string;
    };
  }

  /**
   * Extended JWT interface for token
   */
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    emailVerified?: Date | null;
    image?: string | null;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
    /**
     * Time when the token was last validated
     */
    tokenLastValidated?: number;
  }

  /**
   * Extended User interface
   */
  interface User {
    role: Role;
    createdAt: Date;
    updatedAt: Date;
  }
}

/**
 * Helper function to get the current session identifier
 * Used for session management functionality with JWT strategy
 */
async function getSessionIdentifier(): Promise<string | null> {
  try {
    // With JWT strategy, we don't have direct access to session IDs in the database
    // Instead, we'll use a hash of the user ID + some unique value as a session identifier
    // This will be used for tracking sessions in our custom implementation
    const cookieStore = await cookies();
    const sessionTokenCookie = cookieStore.get(
      process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token"
    );

    if (!sessionTokenCookie?.value) {
      return null;
    }

    // We'll use the first 8 chars of the token as a session identifier
    // This is not the actual token, just a way to identify different sessions
    return sessionTokenCookie.value.slice(0, 8);
  } catch (error) {
    logger.error("Error getting session identifier:", error as Error);
    return null;
  }
}

// Define the callbacks with proper typing
const callbacks: NextAuthConfig["callbacks"] = {
  async jwt({ token, user, account, trigger }) {
    try {
      // Initial sign-in: user object is available
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = (user as unknown as { role: Role }).role;
        token.createdAt = (user as unknown as { createdAt: Date }).createdAt;
        token.updatedAt = (user as unknown as { updatedAt: Date }).updatedAt;
        token.emailVerified = (user as unknown as { emailVerified?: Date }).emailVerified;
        token.image = user.image;
        token.tokenLastValidated = Date.now(); // If account is available, it's a new sign-in
        if (account) {
          // Get session identifier
          const sessionIdentifier = await getSessionIdentifier();

          if (sessionIdentifier) {
            // Record the new JWT session with user agent info
            const headersList = await headers();
            const userAgent = headersList.get("user-agent") || undefined;
            const ip =
              headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || undefined;

            await recordJwtSession(sessionIdentifier, user.id || "", userAgent, ip);
          }

          logger.info("New account sign-in", {
            userId: user.id,
            provider: account.provider,
          });
        }

        return token;
      }

      // For subsequent requests: validate and refresh user data periodically
      const currentTime = Date.now();
      const tokenValidationInterval = 60 * 60 * 1000; // 1 hour

      // First check if the session has been revoked
      if (token.sub) {
        const sessionIdentifier = await getSessionIdentifier();
        if (sessionIdentifier) {
          const isRevoked = await isJwtSessionRevoked(sessionIdentifier);

          if (isRevoked) {
            logger.warn(`Rejected revoked session: ${sessionIdentifier} for user: ${token.sub}`);
            return null; // Reject the token, forcing a new login
          }

          // Update the session's last used timestamp
          await updateJwtSession(sessionIdentifier);
        }
      }

      // Refresh user data if token hasn't been validated recently or on update trigger
      if (
        trigger === "update" ||
        !token.tokenLastValidated ||
        (typeof token.tokenLastValidated === "number" &&
          currentTime - token.tokenLastValidated > tokenValidationInterval)
      ) {
        if (!token.sub) {
          logger.warn("No sub in token, returning null");
          return null;
        }

        // Fetch latest user data from database
        const user = await prisma.user.findUnique({
          where: { id: token.sub },
        });

        if (!user) {
          logger.warn(`User not found for token: ${token.sub}`);
          return null;
        }

        // Update token with latest user data
        token.id = token.sub;
        token.name = user.name;
        token.email = user.email;
        token.emailVerified = user.emailVerified;
        token.image = user.image;
        token.role = user.role;
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;
        token.tokenLastValidated = currentTime;

        logger.debug(`Token refreshed for user: ${token.sub}`);
      }

      return token;
    } catch (error) {
      logger.error("Error in JWT callback", error as Error);
      throw new AuthenticationError("Failed to authenticate user");
    }
  },

  async session({ session, token }) {
    try {
      if (token && token.sub) {
        // Create a properly typed session user object
        const user: typeof session.user = {
          id: token.sub,
          name: token.name as string | null,
          // Ensure email is never undefined, default to empty string if needed
          email: (token.email as string | null) ?? "",
          // Ensure emailVerified is either Date or null, never undefined
          emailVerified: (token.emailVerified as Date | null) ?? null,
          image: token.image as string | null,
          role: token.role as Role,
          createdAt: token.createdAt as Date,
          updatedAt: token.updatedAt as Date,
        };

        // Assign the typed user to session
        session.user = user;

        // Add additional metadata
        // Add session validation time
        (session.user as { sessionLastValidated?: number }).sessionLastValidated = Date.now();

        // Add session identifier for session management
        // This is needed to identify the current session when revoking other sessions
        const sessionIdentifier = await getSessionIdentifier();
        if (sessionIdentifier) {
          (session.user as { sessionToken?: string }).sessionToken = sessionIdentifier;
        }
      }

      return session;
    } catch (error) {
      logger.error("Error in session callback", error as Error);
      throw new AuthenticationError("Failed to create user session");
    }
  },

  async authorized({ auth, request }) {
    const isLoggedIn = !!auth?.user;

    // Get the pathname from the request
    const { pathname } = new URL(request.url);

    // Protected routes logic can be implemented here
    if (pathname.startsWith("/admin") && auth?.user?.role !== Role.ADMIN) {
      return false;
    }

    // For auth pages, redirect logged in users elsewhere
    if (pathname.startsWith("/auth/login") && isLoggedIn) {
      return Response.redirect(new URL("/", request.url));
    }

    // Allow access to auth pages for non-logged in users
    if (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register")) {
      return true;
    }

    // Default: require authentication for all other routes
    return isLoggedIn;
  },
};

/**
 * NextAuth configuration with enhanced error handling, logging, and security
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    signIn: ({ user }) => {
      logger.info(`User signed in: ${user.id}`, { userId: user.id });
    },
    signOut: () => {
      logger.info(`User signed out`);
    },
    createUser: ({ user }) => {
      logger.info(`User created: ${user.id}`, { userId: user.id });
    },
    linkAccount: ({ user }) => {
      logger.info(`Account linked for user: ${user.id}`, { userId: user.id });
    },
  },
  callbacks,
  ...authConfig,
});
