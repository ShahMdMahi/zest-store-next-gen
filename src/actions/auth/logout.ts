"use server";

import { signOut } from "@/auth";
import { logger } from "@/lib/logger";

export async function logout() {
  try {
    await signOut({ redirectTo: "/auth/login" });
    logger.info("User logged out successfully");
    return { success: true, message: "Logged out successfully" };
  } catch (error) {
    logger.error("Logout error:", error as Error);
    return { success: false, error: "Failed to log out" };
  }
}
