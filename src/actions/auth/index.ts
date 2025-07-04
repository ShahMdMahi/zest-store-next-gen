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
import type { LoginFormState } from "./login";
import type { RegisterFormState } from "./register";
import type { SocialLoginParams, SocialLoginResult } from "./social-login";
import type { UserSession } from "./get-sessions";
import type { SessionRevocationResult } from "./revoke-session";

// Re-export the types
export type {
  LoginFormState,
  RegisterFormState,
  SocialLoginParams,
  SocialLoginResult,
  UserSession,
  SessionRevocationResult,
};

// Export the server actions as async functions
export async function login(
  prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  return loginAction(prevState, formData);
}

export async function register(
  prevState: RegisterFormState,
  formData: FormData,
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

export async function socialLogin(
  params: SocialLoginParams,
): Promise<SocialLoginResult> {
  return socialLoginAction(params);
}

export async function getUserSessions(): Promise<{
  sessions: UserSession[];
  error?: string;
}> {
  return getUserSessionsAction();
}

export async function revokeSession(
  sessionId: string,
): Promise<SessionRevocationResult> {
  return revokeSessionAction(sessionId);
}
export async function revokeAllOtherSessions(): Promise<SessionRevocationResult> {
  return revokeAllOtherSessionsAction();
}

export async function initJwtSessionManagement(): Promise<void> {
  return initJwtSessionManagementAction();
}
