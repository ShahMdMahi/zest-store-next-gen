"use server";

import { signIn } from "@/auth";
import { logger } from "@/lib/logger";
import { AuthError } from "next-auth";

export type SocialLoginParams = {
  provider: "github" | "google";
  callbackUrl?: string;
};

export type SocialLoginResult = {
  success: boolean;
  error?: string;
};

/**
 * Server action for handling social login
 */
export async function socialLogin(params: SocialLoginParams): Promise<SocialLoginResult> {
  try {
    const { provider, callbackUrl = "/" } = params;

    logger.info(`Social login initiated with ${provider}`);

    // Initiate the OAuth flow with the provider
    // This will automatically redirect and throw a special NextAuth redirect "error"
    // that should not be caught as an actual error
    await signIn(provider, { redirectTo: callbackUrl });

    // This line will never be reached in normal operation because signIn redirects
    return { success: true };
  } catch (error) {
    // Check if this is a Next.js redirect (which is not an actual error)
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      // This is an expected behavior, not an error
      // Just let the redirect happen
      throw error;
    }

    logger.error(`Error during ${params.provider} social login:`, error as Error);

    let errorMessage = "An unexpected error occurred during social login";

    if (error instanceof AuthError) {
      switch (error.type) {
        case "OAuthSignInError":
          errorMessage = "Could not sign in with the social provider";
          break;
        case "OAuthAccountNotLinked":
          errorMessage = "Email already in use with another account";
          break;
        default:
          errorMessage = `Authentication error: ${error.type}`;
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
