/**
 * Shared form state types for authentication forms
 */

/**
 * Base form state type
 */
export type BaseFormState = {
  errors?: {
    _form?: string[];
    [key: string]: string[] | undefined;
  };
  message?: string | null;
  success: boolean;
};

/**
 * Login form state
 */
export type LoginFormState = BaseFormState & {
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
};

/**
 * Register form state
 */
export type RegisterFormState = BaseFormState & {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    _form?: string[];
  };
};

/**
 * Reset password form state
 */
export type ResetPasswordState = BaseFormState & {
  errors?: {
    password?: string[];
    confirmPassword?: string[];
    token?: string[];
    _form?: string[];
  };
};

/**
 * Request password reset form state
 */
export type RequestResetState = BaseFormState & {
  errors?: {
    email?: string[];
    _form?: string[];
  };
};

/**
 * Verify account form state
 */
export type VerifyAccountState = BaseFormState & {
  errors?: {
    _form?: string[];
  };
};

/**
 * Parameters for social login
 */
export type SocialLoginParams = {
  provider: "github" | "google";
  callbackUrl?: string;
};

/**
 * Result of social login attempt
 */
export type SocialLoginResult = {
  success: boolean;
  error?: string;
};
