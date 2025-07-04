import { z } from "zod";

/**
 * Shared password validation schema
 * Used across registration and password reset forms
 */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .refine(password => /[A-Z]/.test(password), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine(password => /[a-z]/.test(password), {
    message: "Password must contain at least one lowercase letter",
  })
  .refine(password => /[0-9]/.test(password), {
    message: "Password must contain at least one number",
  })
  .refine(password => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password), {
    message: "Password must contain at least one special character",
  });

/**
 * Shared email validation schema
 */
export const emailSchema = z.string().email("Please enter a valid email address");

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, "Password must be at least 8 characters"),
});

/**
 * Registration form validation schema
 */
export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

/**
 * Reset password form validation schema
 */
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
    token: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

/**
 * Request password reset form validation schema
 */
export const requestResetSchema = z.object({
  email: emailSchema,
});

/**
 * Forgot password form validation schema (alias for requestResetSchema)
 */
export const forgotPasswordSchema = requestResetSchema;

/**
 * Resend verification email form validation schema
 */
export const resendVerificationSchema = z.object({
  email: emailSchema,
});
