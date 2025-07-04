"use client";

import { useState } from "react";
import { useActionState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { resetPassword } from "@/actions/auth";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, LockKeyhole, ArrowRight } from "lucide-react";

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
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine(password => /[A-Z]/.test(password), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine(password => /[a-z]/.test(password), {
        message: "Password must contain at least one lowercase letter",
      })
      .refine(password => /[0-9]/.test(password), {
        message: "Password must contain at least one number",
      })
      .refine(password => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password), {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// Form state type
type ResetPasswordFormState = {
  errors?: {
    _form?: string[];
    password?: string[];
    confirmPassword?: string[];
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
          Resetting Password...
        </>
      ) : (
        <>
          <LockKeyhole className="mr-2 h-4 w-4" />
          Reset Password
        </>
      )}
    </Button>
  );
}

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const initialState: ResetPasswordFormState = {
    errors: {},
    message: null,
    success: false,
  };

  const [state, formAction] = useActionState(resetPassword, initialState);
  const [isPendingTransition, startTransition] = useTransition();

  // Initialize react-hook-form
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched", // Validate immediately on blur
    criteriaMode: "all", // Show all validation criteria
  });

  // Custom submit handler to validate form before server action
  const onSubmit = async (data: ResetPasswordFormValues) => {
    // Create a FormData object
    const formData = new FormData();
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    formData.append("token", token);

    // Submit the form data to the server action using startTransition
    startTransition(() => {
      formAction(formData);
    });
  };

  // Show success toast if password was reset successfully
  if (state.success && !state.errors) {
    toast.success("Password reset successful!");
  }

  return (
    <Card className="border-border border shadow-sm">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-center text-xl font-semibold tracking-tight sm:text-2xl">
          Reset Password
        </CardTitle>
        <CardDescription className="text-center">
          Create a new password for your account
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
                Continue to Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <LockKeyhole className="h-3.5 w-3.5" />
                      New Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          autoComplete="new-password"
                          className={`focus:ring-primary pr-10 focus:ring-1 ${form.formState.errors.password ? "border-red-500" : ""}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="text-muted-foreground h-4 w-4" />
                          ) : (
                            <Eye className="text-muted-foreground h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>

                    {/* Display client-side validation errors immediately */}
                    {/* {form.formState.errors.password && (
                      <p className='mt-1 text-xs text-red-500'>
                        {form.formState.errors.password.message}
                      </p>
                    )} */}

                    {/* Display server-side validation errors */}
                    {state.errors?.password && (
                      <FormMessage className="text-destructive">
                        {state.errors.password.join(", ")}
                      </FormMessage>
                    )}
                    <FormMessage />
                    <div className="mt-2 space-y-1">
                      <p className="text-muted-foreground text-xs">Password requirements:</p>
                      <ul className="space-y-1 text-xs">
                        <li
                          className={`flex items-center ${field.value.length >= 8 ? "text-green-500" : "text-muted-foreground"}`}
                        >
                          {field.value.length >= 8 ? (
                            <svg className="mr-1 size-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg className="mr-1 size-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          At least 8 characters
                        </li>
                        <li
                          className={`flex items-center ${/[A-Z]/.test(field.value) ? "text-green-500" : "text-muted-foreground"}`}
                        >
                          {/[A-Z]/.test(field.value) ? (
                            <svg className="mr-1 size-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg className="mr-1 size-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          At least one uppercase letter
                        </li>
                        <li
                          className={`flex items-center ${/[a-z]/.test(field.value) ? "text-green-500" : "text-muted-foreground"}`}
                        >
                          {/[a-z]/.test(field.value) ? (
                            <svg className="mr-1 size-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg className="mr-1 size-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          At least one lowercase letter
                        </li>
                        <li
                          className={`flex items-center ${/[0-9]/.test(field.value) ? "text-green-500" : "text-muted-foreground"}`}
                        >
                          {/[0-9]/.test(field.value) ? (
                            <svg className="mr-1 size-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg className="mr-1 size-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          At least one number
                        </li>
                        <li
                          className={`flex items-center ${/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(field.value) ? "text-green-500" : "text-muted-foreground"}`}
                        >
                          {/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(field.value) ? (
                            <svg className="mr-1 size-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg className="mr-1 size-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          At least one special character
                        </li>
                      </ul>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <LockKeyhole className="h-3.5 w-3.5" />
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          autoComplete="new-password"
                          className={`focus:ring-primary pr-10 focus:ring-1 ${form.formState.errors.confirmPassword ? "border-red-500" : ""}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="text-muted-foreground h-4 w-4" />
                          ) : (
                            <Eye className="text-muted-foreground h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>

                    {/* Display client-side validation errors immediately */}
                    {/* {form.formState.errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {form.formState.errors.confirmPassword.message}
                      </p>
                    )} */}

                    {/* Display server-side validation errors */}
                    {state.errors?.confirmPassword && (
                      <FormMessage className="text-destructive">
                        {state.errors.confirmPassword.join(", ")}
                      </FormMessage>
                    )}
                    <FormMessage />
                    {form.getFieldState("confirmPassword").isDirty && field.value && (
                      <div className="mt-2">
                        {field.value === form.getValues().password ? (
                          <p className="flex items-center text-xs text-green-500">
                            <svg className="mr-1 size-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Passwords match
                          </p>
                        ) : (
                          <p className="text-destructive flex items-center text-xs">
                            <svg className="mr-1 size-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Passwords don't match
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
