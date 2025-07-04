"use client";

// React and React DOM imports
import { useEffect, useTransition } from "react";
import { useActionState } from "react";

// Next.js imports
import Link from "next/link";

// Server actions
import { resendVerificationEmail } from "@/actions/auth";
import type { VerifyAccountState } from "@/lib/form-types";

// Third-party libraries
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Icons
import { Mail } from "lucide-react";

// Validation schemas
import { resendVerificationSchema } from "@/lib/validation-schemas";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define form values type using shared schema
type ResendVerificationFormValues = z.infer<typeof resendVerificationSchema>;

// Import shared submit button component
import { SubmitButton } from "@/components/auth/submit-button";
import z from "zod";

// Use the same state type as the server action for consistency
type ResendVerificationFormState = VerifyAccountState;

export function ResendVerificationForm() {
  const initialState: ResendVerificationFormState = {
    errors: {},
    message: null,
    success: false,
  };

  const [state, formAction] = useActionState(resendVerificationEmail, initialState);
  const [isPendingTransition, startTransition] = useTransition();

  const form = useForm<ResendVerificationFormValues>({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: {
      email: "",
    },
    mode: "onTouched", // Validate immediately on blur
    criteriaMode: "all", // Show all validation criteria
  });

  // Custom submit handler to validate form before server action
  const onSubmit = async (data: ResendVerificationFormValues) => {
    // Create a FormData object
    const formData = new FormData();
    formData.append("email", data.email);

    // Submit the form data to the server action using startTransition
    startTransition(() => {
      formAction(formData);
    });
  };

  // Handle successful verification email send and display toast
  useEffect(() => {
    if (state.success && !state.errors) {
      toast.success("Verification email sent! Please check your inbox.");
      form.reset();
    }
  }, [state.success, state.errors, form]);

  return (
    <Card className="border-border mx-auto w-full border shadow-sm">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-center text-xl font-semibold tracking-tight sm:text-2xl">
          Resend verification email
        </CardTitle>
        <CardDescription className="text-muted-foreground text-center">
          Enter your email address and we&apos;ll send you a new verification link
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state.message && !state.success && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

        {state.errors?._form && !state.success && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{state.errors._form.join(", ")}</AlertDescription>
          </Alert>
        )}

        {state.success && (
          <Alert className="border-primary/50 bg-primary/10 mb-4">
            <AlertDescription className="text-foreground">{state.message}</AlertDescription>
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

                  {/* Display server-side validation errors */}
                  {state.errors?._form && (
                    <FormMessage className="text-destructive">
                      {state.errors._form.join(", ")}
                    </FormMessage>
                  )}
                  <FormMessage />
                  {form.getFieldState("email").isDirty && field.value && (
                    <div className="mt-2">
                      {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value) ? (
                        <p className="flex items-center text-xs text-green-500">
                          <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Valid email format
                        </p>
                      ) : (
                        <p className="flex items-center text-xs text-red-500">
                          <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Please enter a valid email address
                        </p>
                      )}
                    </div>
                  )}
                </FormItem>
              )}
            />
            <SubmitButton
              isSubmitting={isPendingTransition}
              text={
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Resend verification email
                </>
              }
              submittingText="Sending..."
            />
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
