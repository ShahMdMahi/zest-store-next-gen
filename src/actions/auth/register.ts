"use server";

import { z } from "zod";
import { prisma } from "@/prisma";
import { signIn } from "@/auth";
import { logger } from "@/lib/logger";
import { hashPassword } from "@/lib/password-utils";

// Registration validation schema
const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine((password) => /[A-Z]/.test(password), { message: "Password must contain at least one uppercase letter" })
      .refine((password) => /[a-z]/.test(password), { message: "Password must contain at least one lowercase letter" })
      .refine((password) => /[0-9]/.test(password), { message: "Password must contain at least one number" })
      .refine((password) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password), { message: "Password must contain at least one special character" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    _form?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function register(prevState: RegisterFormState, formData: FormData): Promise<RegisterFormState> {
  try {
    // Extract and validate form data
    const validatedFields = registerSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Invalid form data. Please check the errors below.",
        success: false,
      };
    }

    const { name, email, password } = validatedFields.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        errors: {
          email: ["Email already in use"],
          _form: ["An account with this email already exists"],
        },
        message: "An account with this email already exists",
        success: false,
      };
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
        failedLogins: 0,
      },
    });

    // Log the registration
    logger.info(`User registered: ${user.id}`, { userId: user.id });

    // Sign in the user after registration
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return {
      message: "Registration successful! You are now logged in.",
      success: true,
    };
  } catch (error) {
    logger.error("Registration error:", error as Error);

    return {
      errors: {
        _form: ["An unexpected error occurred"],
      },
      message: "An unexpected error occurred. Please try again later.",
      success: false,
    };
  }
}
