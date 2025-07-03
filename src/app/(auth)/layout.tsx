import type { Metadata } from "next";
import { AuthNavbar } from "@/components/auth/navbar";
import { AuthFooter } from "@/components/auth/footer";

export const metadata: Metadata = {
  title: "Auth - Zest Store",
  description: "Authenticate to access your account",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-muted/5 overflow-x-hidden">
      <AuthNavbar />

      <main className="flex-1 flex items-center justify-center relative py-8 sm:py-12">
        {/* Background decorative elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          {/* Top gradient */}
          <div
            className="absolute top-0 left-0 right-0 h-[35rem] bg-gradient-to-b from-primary/5 to-transparent opacity-60"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 80%)",
            }}
            aria-hidden="true"
          ></div>

          {/* Bottom gradient */}
          <div
            className="absolute bottom-0 left-0 h-[50%] w-full bg-gradient-to-t from-muted/10 to-transparent"
            aria-hidden="true"
          ></div>

          {/* Decorative blobs */}
          <div
            className="absolute right-[20%] top-1/4 h-[40rem] w-[40rem] rounded-full bg-primary/5 blur-3xl animate-pulse"
            style={{ animationDuration: "15s" }}
            aria-hidden="true"
          ></div>
          <div
            className="absolute left-[15%] bottom-1/4 h-[30rem] w-[30rem] rounded-full bg-primary/5 blur-3xl animate-pulse"
            style={{ animationDuration: "20s", animationDelay: "2s" }}
            aria-hidden="true"
          ></div>

          {/* Additional subtle elements */}
          <div
            className="absolute left-[40%] top-[10%] h-[20rem] w-[20rem] rounded-full bg-secondary/5 blur-2xl animate-pulse"
            style={{ animationDuration: "25s", animationDelay: "1s" }}
            aria-hidden="true"
          ></div>
          <div
            className="absolute right-[10%] bottom-[15%] h-[15rem] w-[15rem] rounded-full bg-secondary/5 blur-2xl animate-pulse"
            style={{ animationDuration: "18s", animationDelay: "3s" }}
            aria-hidden="true"
          ></div>
        </div>

        {/* Content container with subtle card-like styling */}
        <div className="container max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
          <div className="relative w-full backdrop-blur-sm bg-background/60 dark:bg-background/40 rounded-xl shadow-lg border border-border/30 p-6 sm:p-8">
            {children}
          </div>
        </div>
      </main>

      <AuthFooter />
    </div>
  );
}
