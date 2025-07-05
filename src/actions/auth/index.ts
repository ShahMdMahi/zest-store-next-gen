"use server";

import { login as loginAction } from "./login";
import { register as registerAction } from "./register";
import { logout as logoutAction } from "./logout";
import { socialLogin as socialLoginAction } from "./social-login";
import { getUserSessions as getUserSessionsAction } from "./get-sessions";
import {
  revokeSession as revokeSessionAction,
  revokeAllOtherSessions as revokeAllOtherSessionsAction,
} from "./revoke-session";
import { initJwtSessionManagement as initJwtSessionManagementAction } from "./init-jwt-sessions";
import {
  verifyAccount as verifyAccountAction,
  resendVerificationEmail as resendVerificationEmailAction,
} from "./verify-account";
import {
  requestPasswordReset as requestPasswordResetAction,
  resetPassword as resetPasswordAction,
} from "./reset-password";
import { debugSessions as debugSessionsAction } from "./debug-sessions";

import type { LoginFormState } from "./login";
import type { RegisterFormState } from "./register";
import type { SocialLoginParams, SocialLoginResult } from "./social-login";
import type { UserSession } from "./get-sessions";
import type { SessionRevocationResult } from "./revoke-session";
import type { VerifyAccountState } from "./verify-account";
import type { RequestResetState, ResetPasswordState } from "./reset-password";

// Re-export the types
export type {
  LoginFormState,
  RegisterFormState,
  SocialLoginParams,
  SocialLoginResult,
  UserSession,
  SessionRevocationResult,
  VerifyAccountState,
  RequestResetState,
  ResetPasswordState,
};

// Export the server actions as async functions
export async function login(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  return loginAction(prevState, formData);
}

export async function register(
  prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  return registerAction(prevState, formData);
}

export async function logout(): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  return logoutAction();
}

export async function socialLogin(params: SocialLoginParams): Promise<SocialLoginResult> {
  return socialLoginAction(params);
}

export async function getUserSessions(): Promise<{
  sessions: UserSession[];
  error?: string;
}> {
  return getUserSessionsAction();
}

export async function revokeSession(sessionId: string): Promise<SessionRevocationResult> {
  return revokeSessionAction(sessionId);
}
export async function revokeAllOtherSessions(): Promise<SessionRevocationResult> {
  return revokeAllOtherSessionsAction();
}

export async function initJwtSessionManagement(): Promise<{ success: boolean; cleanedCount?: number; error?: string }> {
  return initJwtSessionManagementAction();
}

export async function verifyAccount(token: string): Promise<VerifyAccountState> {
  return verifyAccountAction(token);
}

export async function resendVerificationEmail(
  prevState: VerifyAccountState,
  formData: FormData
): Promise<VerifyAccountState> {
  const email = formData.get("email") as string;
  return resendVerificationEmailAction(prevState, email);
}

export async function requestPasswordReset(
  prevState: RequestResetState,
  formData: FormData
): Promise<RequestResetState> {
  return requestPasswordResetAction(prevState, formData);
}

export async function resetPassword(
  prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  return resetPasswordAction(prevState, formData);
}

// Debug function
export async function debugSessions() {
  return debugSessionsAction();
}
