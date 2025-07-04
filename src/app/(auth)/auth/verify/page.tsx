import { Metadata } from "next";
import { verifyAccount } from "@/actions/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, MailCheck } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Email Verification | Zest Store",
  description: "Verify your email address for Zest Store",
};

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const token = params.token as string | undefined;

  // If no token is provided
  if (!token) {
    return (
      <div className="mx-auto w-full max-w-md py-6 sm:py-8 md:py-12">
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-destructive/10 ring-destructive/30 flex h-12 w-12 items-center justify-center rounded-full ring-1">
              <XCircle className="text-destructive h-6 w-6" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Email Verification</h1>
          <p className="text-muted-foreground mt-2 text-sm">Invalid verification request</p>
        </div>
        <Card className="border-border border shadow-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-center text-xl font-semibold tracking-tight sm:text-2xl">
              Invalid Verification
            </CardTitle>
            <CardDescription className="text-center">
              Please check your verification link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="text-sm">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Invalid verification token. Please check your email for the correct verification
                link.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="pt-6">
            <Button className="w-full sm:w-auto" asChild>
              <Link href="/auth/login">Back to Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Verify the account
  const result = await verifyAccount(token);

  return (
    <div className="mx-auto w-full max-w-md py-6 sm:py-8 md:py-12">
      <div className="mb-8 text-center">
        <div className="mb-6 flex justify-center">
          <div
            className={`${result.success ? "bg-primary/10 ring-primary/30" : "bg-destructive/10 ring-destructive/30"} flex h-12 w-12 items-center justify-center rounded-full ring-1`}
          >
            {result.success ? (
              <MailCheck className="text-primary h-6 w-6" />
            ) : (
              <XCircle className="text-destructive h-6 w-6" />
            )}
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Email Verification</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          {result.success ? "Your email has been verified" : "Verification failed"}
        </p>
      </div>

      <Card className="border-border border shadow-sm">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-center text-xl font-semibold tracking-tight sm:text-2xl">
            {result.success ? "Verification Successful" : "Verification Failed"}
          </CardTitle>
          <CardDescription className="text-center">
            {result.success
              ? "Your account has been verified"
              : "There was a problem with verification"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant={result.success ? "default" : "destructive"} className="text-sm">
            {result.success ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="pt-6">
          <Button className="w-full sm:w-auto" asChild>
            <Link href="/auth/login">{result.success ? "Continue to Login" : "Back to Login"}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
