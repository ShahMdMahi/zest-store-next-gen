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
    <div className="min-h-screen flex flex-col bg-background">
      <RootNavbar />
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-6 md:py-8 pb-20 md:pb-6">
        {children}
      </main>
      <RootFooter />
    </div>
  );
}
