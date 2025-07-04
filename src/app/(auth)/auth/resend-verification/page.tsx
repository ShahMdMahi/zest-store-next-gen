import { ResendVerificationForm } from "@/components/auth/resend-verification-form";
import { MailCheck } from "lucide-react";

export const metadata = {
  title: "Resend Verification Email | Zest Store",
  description: "Request a new verification email for your Zest Store account",
};

export default function ResendVerificationPage() {
  return (
    <div className="mx-auto w-full max-w-md py-6 sm:py-8 md:py-12">
      <div className="mb-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-primary/10 ring-primary/20 flex h-12 w-12 items-center justify-center rounded-full ring-1">
            <MailCheck className="text-primary h-6 w-6" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Resend Verification Email</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Enter your email to receive a new verification link
        </p>
      </div>
      <ResendVerificationForm />
    </div>
  );
}
