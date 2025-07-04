"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useFormStatus } from "react-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { resendVerificationEmail } from "@/actions/auth";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2, Mail, ArrowRight, MailCheck } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define form validation schema
const resendVerificationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ResendVerificationFormValues = z.infer<typeof resendVerificationSchema>;

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <Button type="submit" className="w-full" disabled={isSubmitting}>
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
        </>
      ) : (
        <>
          Resend verification email <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}

export function ResendVerificationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<ResendVerificationFormValues>({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ResendVerificationFormValues) {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await resendVerificationEmail(data.email);

      if (result.success) {
        setSuccess(result.message || "Verification email sent! Please check your inbox.");
        form.reset();
        toast.success("Verification email sent!");
      } else {
        setError(
          result.message ||
            result.errors?._form?.join(", ") ||
            "An error occurred. Please try again."
        );
        toast.error("Failed to send verification email");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
      toast.error("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="border-border mx-auto w-full border shadow-sm">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-center text-xl font-semibold tracking-tight sm:text-2xl">
          Resend verification email
        </CardTitle>
        <CardDescription className="text-muted-foreground text-center">
          Enter your email address and we'll send you a new verification link
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert variant="default" className="bg-primary/10 border-primary/20 text-primary mb-4">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your.email@example.com"
                      type="email"
                      autoComplete="email"
                      className="focus:ring-primary focus:ring-1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton isSubmitting={isSubmitting} />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 px-6 pt-0 pb-6">
        <div className="pt-2 text-center">
          <p className="text-muted-foreground text-sm">
            Remember your password?{" "}
            <Link
              href="/auth/login"
              className="text-primary font-medium underline-offset-4 transition-colors hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
