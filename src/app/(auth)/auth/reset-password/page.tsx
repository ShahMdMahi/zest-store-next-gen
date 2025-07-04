import { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { LockKeyhole } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Reset Password | Zest Store",
  description: "Set a new password for your Zest Store account",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const token = params.token as string | undefined;

  if (!token) {
    return (
      <div className="mx-auto w-full max-w-md py-6 sm:py-8 md:py-12">
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-destructive/10 ring-destructive/20 flex h-12 w-12 items-center justify-center rounded-full ring-1">
              <LockKeyhole className="text-destructive h-6 w-6" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Invalid Reset Link</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            The password reset link is invalid or has expired
          </p>
        </div>

        <Card className="border-border border shadow-sm">
          <CardContent>
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                No reset token found. Please request a new password reset link.
              </AlertDescription>
            </Alert>

            <Button asChild className="w-full">
              <Link href="/auth/forgot-password">Request New Reset Link</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md py-6 sm:py-8 md:py-12">
      <div className="mb-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-primary/10 ring-primary/20 flex h-12 w-12 items-center justify-center rounded-full ring-1">
            <LockKeyhole className="text-primary h-6 w-6" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Reset Your Password</h1>
        <p className="text-muted-foreground mt-2 text-sm">Enter a new password for your account</p>
      </div>
      <ResetPasswordForm token={token} />
    </div>
  );
}
