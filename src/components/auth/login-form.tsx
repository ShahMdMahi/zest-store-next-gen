"use client";

import { useActionState, useState, useTransition, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { login, socialLogin } from "@/actions/auth";
import type { LoginFormState } from "@/actions/auth/login";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Github, Loader2, LockKeyhole, LogIn, Mail } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define form validation schema
const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

// Submit button component to handle form submission state
function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = pending || isSubmitting;

  return (
    <Button type="submit" className="w-full transition-all" disabled={isDisabled}>
      {isDisabled ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Logging in...
        </>
      ) : (
        <>
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </>
      )}
    </Button>
  );
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");

  const initialState: LoginFormState = { errors: {}, message: null, success: false };
  const [state, formAction] = useActionState(login, initialState);

  // Initialize react-hook-form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange", // Validate on field change
    criteriaMode: "all", // Show all validation criteria
  });

  // Initialize useTransition for action state
  const [isPendingTransition, startTransition] = useTransition();

  // Custom submit handler to validate form before server action
  const onSubmit = async (data: LoginFormValues) => {
    // Create a FormData object
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    // Submit the form data to the server action using startTransition
    startTransition(() => {
      formAction(formData);
    });
  };

  // Handle successful login and redirect
  useEffect(() => {
    if (state.success && !state.errors) {
      toast.success("Login successful!");
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
    <Card className="w-full mx-auto border border-border shadow-sm">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-xl sm:text-2xl font-semibold tracking-tight text-center">Login</CardTitle>
        <CardDescription className="text-center text-muted-foreground">Enter your credentials to access your account</CardDescription>
        {error && (
          <p className="text-sm font-medium text-destructive text-center mt-2 animate-pulse">{error === "CredentialsSignin" ? "Invalid email or password" : "An error occurred. Please try again."}</p>
        )}
      </CardHeader>
      <CardContent>
        {state.errors?._form && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{state.errors._form.join(", ")}</AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <Input placeholder="your.email@example.com" type="email" autoComplete="email" className="focus:ring-1 focus:ring-primary" {...field} />
                  </FormControl>
                  {state.errors?.email && <FormMessage className="text-destructive">{state.errors.email.join(", ")}</FormMessage>}
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
                      <Input placeholder="••••••••" type={showPassword ? "text" : "password"} autoComplete="current-password" className="focus:ring-1 focus:ring-primary pr-10" {...field} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                      </Button>
                    </div>
                  </FormControl>
                  {state.errors?.password && <FormMessage className="text-destructive">{state.errors.password.join(", ")}</FormMessage>}
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton isSubmitting={isPendingTransition} />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 pt-0 px-6 pb-6">
        <div className="relative w-full my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 w-full">
          <Button variant="outline" className="w-full transition-all" onClick={() => handleSocialLogin("github")} disabled={isPending || isPendingTransition}>
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Github className="mr-2 h-4 w-4" /> GitHub
              </>
            )}
          </Button>
          <Button variant="outline" className="w-full transition-all" onClick={() => handleSocialLogin("google")} disabled={isPending || isPendingTransition}>
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  <path fill="none" d="M1 1h22v22H1z" />
                </svg>
                Google
              </>
            )}
          </Button>
        </div>
        <div className="text-center pt-2">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="font-medium text-primary underline-offset-4 hover:underline transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
