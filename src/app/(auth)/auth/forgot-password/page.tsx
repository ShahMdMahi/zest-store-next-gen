import { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { KeyRound } from "lucide-react";

export const metadata: Metadata = {
  title: "Forgot Password | Zest Store",
  description: "Reset your Zest Store password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto w-full max-w-md py-6 sm:py-8 md:py-12">
      <div className="mb-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-primary/10 ring-primary/20 flex h-12 w-12 items-center justify-center rounded-full ring-1">
            <KeyRound className="text-primary h-6 w-6" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Forgot your password?</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Enter your email address to receive a password reset link
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
