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
  Column,
  Row,
  Tailwind,
} from "@react-email/components";

interface WelcomeEmailProps {
  username?: string;
  userEmail?: string;
}

export const WelcomeEmail = ({
  username = "Valued Customer",
  userEmail = "customer@example.com",
}: WelcomeEmailProps) => {
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
          "chart-1": "oklch(0.6723 0.1606 244.9955)",
          "chart-2": "oklch(0.6907 0.1554 160.3454)",
        },
      },
    },
  };

  return (
    <Html>
      <Head />
      <Preview>Welcome to Zest Store - Start Shopping Today!</Preview>
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

            <Section className="rounded-xl border border-slate-200 bg-white p-5">
              <Heading className="text-primary my-5 text-center text-2xl font-bold">
                Welcome to Zest Store!
              </Heading>
              <Text className="text-foreground my-4 text-base leading-7">Hi {username},</Text>
              <Text className="text-foreground my-4 text-base leading-7">
                Thank you for creating an account with us. We're thrilled to have you join our
                community of shoppers!
              </Text>

              <Section className="bg-accent my-6 rounded-md p-4">
                <Text className="text-foreground my-0 text-base leading-7">
                  <strong>Account Information:</strong>
                  <br />
                  Email: {userEmail}
                </Text>
              </Section>

              <Text className="text-foreground my-4 text-base leading-7">
                With your new account, you can:
              </Text>

              <Section>
                <Row>
                  <Column className="p-3 text-center">
                    <Img
                      src={`${baseUrl}/images/shopping-cart.png`}
                      width="50"
                      height="50"
                      alt="Shop"
                    />
                    <Text className="text-foreground my-3 text-center text-sm">
                      Shop our latest products
                    </Text>
                  </Column>
                  <Column className="p-3 text-center">
                    <Img
                      src={`${baseUrl}/images/heart.png`}
                      width="50"
                      height="50"
                      alt="Favorites"
                    />
                    <Text className="text-foreground my-3 text-center text-sm">
                      Save your favorites
                    </Text>
                  </Column>
                  <Column className="p-3 text-center">
                    <Img
                      src={`${baseUrl}/images/package.png`}
                      width="50"
                      height="50"
                      alt="Track Orders"
                    />
                    <Text className="text-foreground my-3 text-center text-sm">
                      Track your orders
                    </Text>
                  </Column>
                </Row>
              </Section>

              <Section className="my-8 text-center">
                <Button
                  className="bg-primary text-primary-foreground inline-block rounded-md px-5 py-3 text-base font-bold no-underline"
                  href={`${baseUrl}/shop`}
                >
                  Start Shopping Now
                </Button>
              </Section>

              <Hr className="border-border my-8" />

              <Text className="text-foreground my-4 text-base leading-7">
                If you have any questions or need assistance, don't hesitate to contact our support
                team.
              </Text>
              <Text className="text-foreground my-4 text-base leading-7">Happy shopping!</Text>
              <Text className="text-foreground mt-8 text-base italic">The Zest Store Team</Text>
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
                123 Zest Street, Somewhere City, ST 12345
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
