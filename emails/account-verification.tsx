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

interface AccountVerificationEmailProps {
  username?: string;
  verificationLink?: string;
  expiryTime?: string;
}

export const AccountVerificationEmail = ({
  username = "Valued Customer",
  verificationLink = "http://localhost:3000/auth/verify?token=<token>",
  expiryTime = "24 hours",
}: AccountVerificationEmailProps) => {
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
        },
      },
    },
  };

  return (
    <Html>
      <Head />
      <Preview>Verify your email address for your Zest Store account</Preview>
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
            <Section className="bg-background border-border rounded-xl border p-5">
              <Heading className="text-primary my-5 text-center text-2xl font-bold">
                Verify Your Email Address
              </Heading>
              <Text className="text-foreground my-4 text-base leading-7">Hi {username},</Text>
              <Text className="text-foreground my-4 text-base leading-7">
                Thank you for registering with Zest Store. To complete your account setup and start
                shopping, please verify your email address.
              </Text>

              <Text className="text-foreground my-4 text-base leading-7">
                Please click the button below to verify your email address:
              </Text>

              <Section className="my-8 text-center">
                <Button
                  className="bg-primary text-primary-foreground inline-block rounded-md px-5 py-3 text-base font-bold no-underline"
                  href={verificationLink}
                >
                  Verify Your Email
                </Button>
              </Section>

              <Text className="text-foreground my-4 text-base leading-7">
                This verification link will expire in {expiryTime}.
              </Text>

              <Text className="text-foreground my-4 text-base leading-7">
                Or copy and paste this URL into your browser:
              </Text>
              <Text className="text-foreground my-2 text-center text-sm break-all">
                <Link href={verificationLink} className="text-primary underline">
                  {verificationLink}
                </Link>
              </Text>

              <Hr className="border-border my-8" />

              <Text className="text-foreground my-4 text-base leading-7">
                If you didn't request this verification, you can safely ignore this email.
              </Text>
              <Text className="text-foreground my-6 text-sm italic">
                For your security, this verification link will expire after {expiryTime}.
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
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default AccountVerificationEmail;
