import { Metadata } from "next";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata: Metadata = {
  title: "Error | Zest Store",
  description: "An error occurred during authentication",
};

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : "An unexpected error occurred";

  // Map known error codes to user-friendly messages
  const errorMessages: Record<string, string> = {
    CredentialsSignin: "The email or password you entered is incorrect.",
    OAuthAccountNotLinked: "This account is already linked to a different authentication provider.",
    AccessDenied: "Access denied. You don't have permission to access this resource.",
    Configuration: "There is a problem with the authentication configuration.",
    Default: "An unexpected authentication error occurred.",
  };

  const errorMessage = errorMessages[error] || errorMessages["Default"];

  return (
    <div className="mx-auto w-full max-w-md py-6 sm:py-8 md:py-12">
      <div className="mb-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-destructive/10 ring-destructive/30 flex h-12 w-12 items-center justify-center rounded-full ring-1">
            <AlertCircle className="text-destructive h-6 w-6" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Authentication Error</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          There was a problem with your authentication request
        </p>
      </div>

      <Card className="border-border border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold">Unable to Sign In</CardTitle>
          <CardDescription>Please review the error below</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="text-sm">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pt-6 sm:flex-row">
          <Button variant="outline" className="w-full sm:w-auto" asChild>
            <Link href="/auth/login">
              <ArrowLeft className="mr-2 h-4 w-4" /> Return to Login
            </Link>
          </Button>
          <Button className="w-full sm:w-auto" asChild>
            <Link href="/">
              <RefreshCw className="mr-2 h-4 w-4" /> Try Again
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
