"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface LogoutButtonProps {
  redirectUrl?: string;
  className?: string;
  children?: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function LogoutButton({ redirectUrl = "/auth/login", className, children, variant = "destructive" }: LogoutButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    startTransition(async () => {
      try {
        const result = await logout();

        if (result.success) {
          toast.success("Logged out successfully");
          router.push(redirectUrl);
          router.refresh();
        } else {
          toast.error(result.error || "Failed to log out");
        }
      } catch (error) {
        console.error("Logout error:", error);
        toast.error("An error occurred while logging out");
      }
    });
  };

  return (
    <Button variant={variant} onClick={handleLogout} disabled={isPending} className={cn(className)}>
      {isPending ? "Signing out..." : children || "Sign out"}
    </Button>
  );
}
