"use server";

import { login as loginAction } from "./login";
import { register as registerAction } from "./register";
import { logout as logoutAction } from "./logout";
import { socialLogin as socialLoginAction } from "./social-login";
import type { LoginFormState } from "./login";
import type { RegisterFormState } from "./register";
import type { SocialLoginParams, SocialLoginResult } from "./social-login";

// Re-export the types
export type {
  LoginFormState,
  RegisterFormState,
  SocialLoginParams,
  SocialLoginResult,
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
