"use client";

import { useState } from "react";
import { useActionState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { requestPasswordReset } from "@/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail, ArrowRight } from "lucide-react";

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
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

// Form state type
type ForgotPasswordFormState = {
  errors?: {
    _form?: string[];
    email?: string[];
  };
  message?: string | null;
  success: boolean;
};

// Submit button component to handle form submission state
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full transition-all" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending...
        </>
      ) : (
        <>
          <Mail className="mr-2 h-4 w-4" />
          Send Reset Link
        </>
      )}
    </Button>
  );
}

export function ForgotPasswordForm() {
  const router = useRouter();

  const initialState: ForgotPasswordFormState = {
    errors: {},
    message: null,
    success: false,
  };

  const [state, formAction] = useActionState(requestPasswordReset, initialState);
  const [isPendingTransition, startTransition] = useTransition();

  // Initialize react-hook-form
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onTouched", // Validate immediately on blur
    criteriaMode: "all", // Show all validation criteria
  });

  // Custom submit handler to validate form before server action
  const onSubmit = async (data: ForgotPasswordFormValues) => {
    // Create a FormData object
    const formData = new FormData();
    formData.append("email", data.email);

    // Submit the form data to the server action using startTransition
    startTransition(() => {
      formAction(formData);
    });
  };

  // Show success toast if the email was sent successfully
  if (state.success && !state.errors) {
    toast.success("Reset link sent! Please check your email.");
  }

  return (
    <Card className="border-border border shadow-sm">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-center text-xl font-semibold tracking-tight sm:text-2xl">
          Forgot Password
        </CardTitle>
        <CardDescription className="text-center">
          Enter your email address and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state.message && !state.success && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

        {state.errors?._form && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{state.errors._form.join(", ")}</AlertDescription>
          </Alert>
        )}

        {state.success ? (
          <div className="space-y-6">
            <Alert className="border-primary/50 bg-primary/10">
              <AlertDescription className="text-foreground">{state.message}</AlertDescription>
            </Alert>
            <Button asChild className="w-full">
              <Link href="/auth/login">
                Back to Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
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
                        {...field}
                        type="email"
                        placeholder="your@email.com"
                        autoComplete="email"
                        className={`focus:ring-primary focus:ring-1 ${form.formState.errors.email ? "border-red-500" : ""}`}
                      />
                    </FormControl>

                    {/* Display client-side validation errors immediately */}
                    {/* {form.formState.errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {form.formState.errors.email.message}
                      </p>
                    )} */}

                    {/* Display server-side validation errors */}
                    {state.errors?.email && (
                      <FormMessage className="text-destructive">
                        {state.errors.email.join(", ")}
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

              <SubmitButton />
            </form>
          </Form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center px-6 pb-6">
        {!state.success && (
          <div className="text-center text-sm">
            <Link href="/auth/login" className="text-primary hover:underline">
              Back to Login
            </Link>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
