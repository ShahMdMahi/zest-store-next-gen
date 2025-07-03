import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/prisma";
import { logger } from "@/lib/logger";

/**
 * Enhanced NextAuth configuration with multiple providers
 * and secure credential handling
 */
export default {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            logger.warn("Missing credentials during login attempt");
            return null;
          }

          // Make sure credentials.email is a string
          if (typeof credentials.email !== "string") {
            logger.warn("Email credential is not a string");
            return null;
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            logger.warn(
              `Login attempt with email not found: ${credentials.email}`,
            );
            return null;
          }

          // Handle users without passwords (OAuth users)
          if (!user.password) {
            logger.warn(
              `Password login attempt for OAuth user: ${credentials.email}`,
            );
            throw new Error(
              "This account cannot use password login. Please use the provider you signed up with.",
            );
          }

          // Make sure credentials.password is a string
          if (typeof credentials.password !== "string") {
            logger.warn("Password credential is not a string");
            return null;
          }

          // Verify password
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!passwordMatch) {
            logger.warn(
              `Failed login attempt (password mismatch): ${credentials.email}`,
            );
            return null;
          }

          logger.info(`Successful credential login: ${credentials.email}`);
          return user;
        } catch (error) {
          logger.error("Error in credential authorization", error as Error);
          return null;
        }
      },
    }),
  ],
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? `__Secure-next-auth.session-token`
          : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
} satisfies NextAuthConfig;
