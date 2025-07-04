import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Login | Zest Store",
  description: "Login to your Zest Store account",
};

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-md py-6 sm:py-8 md:py-12">
      <div className="mb-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-primary/10 ring-primary/20 flex h-12 w-12 items-center justify-center rounded-full ring-1">
            <Layers className="text-primary h-6 w-6" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Welcome back</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Enter your credentials to access your account
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
