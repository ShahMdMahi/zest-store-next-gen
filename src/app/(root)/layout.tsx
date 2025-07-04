import type { Metadata } from "next";
import { RootNavbar } from "@/components/root/navbar";
import { RootFooter } from "@/components/root/footer";

export const metadata: Metadata = {
  title: "Home - Zest Store",
  description: "The best store for all your needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <RootNavbar />
      <main className="container mx-auto max-w-7xl flex-1 px-4 py-6 pb-20 md:py-8 md:pb-6">
        {children}
      </main>
      <RootFooter />
    </div>
  );
}
