import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";
import { UserPlus } from "lucide-react";

export const metadata: Metadata = {
  title: "Register | Zest Store",
  description: "Create a new Zest Store account",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto w-full max-w-md py-6 sm:py-8 md:py-12">
      <div className="mb-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-primary/10 ring-primary/20 flex h-12 w-12 items-center justify-center rounded-full ring-1">
            <UserPlus className="text-primary h-6 w-6" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Welcome to Zest Store</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Enter your credentials to create your account
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
