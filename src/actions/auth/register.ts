"use server";

import { prisma } from "@/prisma";
import { logger } from "@/lib/logger";
import { hashPassword } from "@/lib/password-utils";
import { generateToken } from "@/lib/auth-utils";
import { sendWelcomeEmail, sendAccountVerificationEmail } from "@/actions/email";
import { registerSchema } from "@/lib/validation-schemas";
import { RegisterFormState } from "@/lib/form-types";

export type { RegisterFormState };

export async function register(
  prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
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

    // Generate verification token
    const verificationToken = await generateToken();
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + 24); // Token valid for 24 hours

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
        failedLogins: 0,
        emailVerified: null,
        verificationToken,
        verificationTokenExpiry: expiryTime,
      },
    });

    // Log the registration
    logger.info(`User registered: ${user.id}`, { userId: user.id });

    // Send welcome email
    await sendWelcomeEmail(email, name);

    // Send verification email
    await sendAccountVerificationEmail(email, name, verificationToken, "24 hours");

    // No longer signing in the user automatically after registration
    // Users will need to verify their email and log in manually

    return {
      message:
        "Registration successful! Please check your email to verify your account before logging in.",
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
