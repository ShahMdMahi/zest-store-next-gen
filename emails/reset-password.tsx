import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Button,
  Hr,
  Tailwind,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  username?: string;
  resetLink?: string;
  expiryTime?: string;
}

export const ResetPasswordEmail = ({
  username = "Valued Customer",
  resetLink = "http://localhost:3000/auth/reset-password?token=<token>",
  expiryTime = "15 minutes",
}: ResetPasswordEmailProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Tailwind config with colors from globals.css
  const tailwindConfig = {
    theme: {
      extend: {
        colors: {
          primary: "oklch(0.6723 0.1606 244.9955)",
          "primary-foreground": "oklch(1 0 0)",
          secondary: "oklch(0.1884 0.0128 248.5103)",
          "secondary-foreground": "oklch(1 0 0)",
          background: "oklch(1 0 0)",
          foreground: "oklch(0.1884 0.0128 248.5103)",
          muted: "oklch(0.9222 0.0013 286.3737)",
          "muted-foreground": "oklch(0.1884 0.0128 248.5103)",
          accent: "oklch(0.9392 0.0166 250.8453)",
          "accent-foreground": "oklch(0.6723 0.1606 244.9955)",
          destructive: "oklch(0.6188 0.2376 25.7658)",
          border: "oklch(0.9317 0.0118 231.6594)",
          input: "oklch(0.9809 0.0025 228.7836)",
          ring: "oklch(0.6818 0.1584 243.354)",
          "chart-2": "oklch(0.6907 0.1554 160.3454)",
        },
      },
    },
  };

  return (
    <Html>
      <Head />
      <Preview>Reset your Zest Store password</Preview>
      <Tailwind config={tailwindConfig}>
        <Body className="bg-white font-sans leading-normal">
          <Container className="mx-auto my-0 max-w-[600px] px-0 py-5">
            <Section className="py-5 text-center">
              <Img
                src={`${baseUrl}/logo/logo_colored-nobg.png`}
                width="120"
                height="52"
                alt="Zest Store"
                className="mx-auto"
              />
            </Section>

            <Section className="bg-background border-border rounded-xl border p-5 text-center">
              <Img
                src={`${baseUrl}/images/lock.png`}
                width="64"
                height="64"
                alt="Lock Icon"
                className="mx-auto mb-4 block"
              />

              <Heading className="text-primary my-5 text-2xl font-bold">
                Password Reset Request
              </Heading>

              <Text className="text-foreground my-4 text-left text-base leading-7">
                Hi {username},
              </Text>
              <Text className="text-foreground my-4 text-left text-base leading-7">
                We received a request to reset the password for your Zest Store account. To proceed
                with resetting your password, click the button below:
              </Text>

              <Section className="my-8 text-center">
                <Button
                  className="bg-primary text-primary-foreground inline-block rounded-md px-5 py-3 text-base font-bold no-underline"
                  href={resetLink}
                >
                  Reset Your Password
                </Button>
              </Section>

              <Text className="text-foreground my-4 text-left text-base leading-7">
                Or copy and paste this URL into your browser:
              </Text>
              <Text className="text-foreground my-2 text-center text-sm break-all">
                <Link href={resetLink} className="text-primary underline">
                  {resetLink}
                </Link>
              </Text>

              <Section className="border-chart-2 my-8 rounded border-l-4 bg-[#a3e0c9] px-4 py-3 text-left">
                <Text className="text-foreground m-0 text-[15px]">
                  This password reset link will expire in {expiryTime}.
                </Text>
              </Section>

              <Hr className="border-border my-8" />

              <Text className="text-foreground bg-muted my-6 rounded-md p-4 text-left text-[15px]">
                <strong>Security Notice:</strong> If you didn't request a password reset, please
                ignore this email or contact our support team if you have concerns about your
                account security.
              </Text>

              <Text className="text-foreground my-4 text-left text-base leading-7">
                For additional security tips or help with your account, please visit our{" "}
                <Link className="text-primary underline" href={`${baseUrl}/help`}>
                  Help Center
                </Link>
                .
              </Text>
            </Section>

            <Section className="mt-8 p-0 text-center">
              <Text className="text-foreground my-2 text-sm">
                © {new Date().getFullYear()} Zest Store. All rights reserved.
              </Text>
              <Text className="text-foreground my-2 text-sm">
                <Link className="text-primary underline" href={`${baseUrl}/privacy`}>
                  Privacy Policy
                </Link>{" "}
                ·{" "}
                <Link className="text-primary underline" href={`${baseUrl}/terms`}>
                  Terms of Service
                </Link>
              </Text>
              <Text className="text-foreground my-4 text-sm">
                Need help?{" "}
                <Link className="text-primary underline" href={`${baseUrl}/contact`}>
                  Contact our support team
                </Link>
              </Text>
              <Text className="text-foreground my-4 text-sm italic">
                123 Zest Street, Somewhere City, ST 12345
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ResetPasswordEmail;
