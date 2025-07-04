"use client";

import { useActionState, useState, useTransition, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { register, socialLogin } from "@/actions/auth";
import type { RegisterFormState } from "@/actions/auth/register";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Github, Loader2, LockKeyhole, Mail, User, UserPlus } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define form validation schema
const registerFormSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
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

type RegisterFormValues = z.infer<typeof registerFormSchema>;

// Submit button component to handle form submission state
function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = pending || isSubmitting;

  return (
    <Button type="submit" className="w-full transition-all" disabled={isDisabled}>
      {isDisabled ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating account...
        </>
      ) : (
        <>
          <UserPlus className="mr-2 h-4 w-4" />
          Create account
        </>
      )}
    </Button>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");

  const initialState: RegisterFormState = {
    errors: {},
    message: null,
    success: false,
  };
  const [state, formAction] = useActionState(register, initialState);

  // Initialize react-hook-form
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange", // Validate on field change
    criteriaMode: "all", // Show all validation criteria
  });

  // Initialize useTransition for action state
  const [isPendingTransition, startTransition] = useTransition();

  // Custom submit handler to validate form before server action
  const onSubmit = async (data: RegisterFormValues) => {
    // Create a FormData object
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);

    // Submit the form data to the server action using startTransition
    startTransition(() => {
      formAction(formData);
    });
  };

  // Handle successful registration and redirect
  useEffect(() => {
    if (state.success && !state.errors) {
      toast.success("Registration successful!");
      router.push(callbackUrl);
      router.refresh();
    }
  }, [state.success, state.errors, router, callbackUrl]);

  // Handle social login with server action
  const handleSocialLogin = async (provider: "github" | "google") => {
    try {
      setIsPending(true);

      // Call the server action for social login
      startTransition(async () => {
        // The actual redirection happens server-side
        await socialLogin({
          provider,
          callbackUrl,
        });
      });
    } catch (error) {
      console.error(`${provider} login error:`, error);
      toast.error(`An error occurred with ${provider} login. Please try again.`);
      setIsPending(false);
    }
  };

  return (
    <Card className="border-border mx-auto w-full border shadow-sm">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-center text-xl font-semibold tracking-tight sm:text-2xl">
          Create an Account
        </CardTitle>
        <CardDescription className="text-muted-foreground text-center">
          Enter your details to create your account
        </CardDescription>
        {error && (
          <p className="text-destructive mt-2 animate-pulse text-center text-sm font-medium">
            {error === "CredentialsSignin"
              ? "Invalid email or password"
              : "An error occurred. Please try again."}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {state.errors?._form && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{state.errors._form.join(", ")}</AlertDescription>
          </Alert>
        )}{" "}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your Name"
                      autoComplete="name"
                      className="focus:ring-primary focus:ring-1"
                      {...field}
                    />
                  </FormControl>
                  {state.errors?.name && (
                    <FormMessage className="text-destructive">
                      {state.errors.name.join(", ")}
                    </FormMessage>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  {state.errors?.email && (
                    <FormMessage className="text-destructive">
                      {state.errors.email.join(", ")}
                    </FormMessage>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <LockKeyhole className="h-3.5 w-3.5" />
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className="focus:ring-primary pr-10 focus:ring-1"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground absolute top-0 right-0 h-full px-3 py-2"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  {/* Display client-side validation errors immediately  */}
                  {/* {form.formState.errors.password && (
                    <p className="text-red-500 text-xs mt-1">
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
                        placeholder="••••••••"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className="focus:ring-primary pr-10 focus:ring-1"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground absolute top-0 right-0 h-full px-3 py-2"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        )}
                        <span className="sr-only">
                          {showConfirmPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  {state.errors?.confirmPassword && (
                    <FormMessage className="text-destructive">
                      {state.errors.confirmPassword.join(", ")}
                    </FormMessage>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="link"
                className="text-primary px-0 text-sm font-medium underline-offset-4 hover:underline"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? "Hide password" : "Show password"}
              </Button>
              <Button
                type="button"
                variant="link"
                className="text-primary px-0 text-sm font-medium underline-offset-4 hover:underline"
                onClick={() => setShowConfirmPassword(prev => !prev)}
              >
                {showConfirmPassword ? "Hide password" : "Show password"}
              </Button>
            </div>

            <SubmitButton isSubmitting={isPendingTransition} />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 px-6 pt-0 pb-6">
        <div className="relative my-2 w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="border-border w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card text-muted-foreground px-2">Or continue with</span>
          </div>
        </div>
        <div className="grid w-full grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="w-full transition-all"
            onClick={() => handleSocialLogin("github")}
            disabled={isPending || isPendingTransition}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Github className="mr-2 h-4 w-4" /> GitHub
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="w-full transition-all"
            onClick={() => handleSocialLogin("google")}
            disabled={isPending || isPendingTransition}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                  <path fill="none" d="M1 1h22v22H1z" />
                </svg>
                Google
              </>
            )}
          </Button>
        </div>
        <div className="pt-2 text-center">
          <p className="text-muted-foreground text-sm">
            Already have an account?{" "}
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
