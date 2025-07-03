import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Login | Zest Store",
  description: "Login to your Zest Store account",
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-md mx-auto py-6 sm:py-8 md:py-12">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
            <Layers className="h-6 w-6 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
