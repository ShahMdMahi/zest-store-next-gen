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
    <div className="bg-muted/5 flex min-h-screen flex-col overflow-x-hidden">
      <AuthNavbar />

      <main className="relative flex flex-1 items-center justify-center py-8 sm:py-12">
        {/* Background decorative elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          {/* Top gradient */}
          <div
            className="from-primary/5 absolute top-0 right-0 left-0 h-[35rem] bg-gradient-to-b to-transparent opacity-60"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 80%)",
            }}
            aria-hidden="true"
          ></div>

          {/* Bottom gradient */}
          <div
            className="from-muted/10 absolute bottom-0 left-0 h-[50%] w-full bg-gradient-to-t to-transparent"
            aria-hidden="true"
          ></div>

          {/* Decorative blobs */}
          <div
            className="bg-primary/5 absolute top-1/4 right-[20%] h-[40rem] w-[40rem] animate-pulse rounded-full blur-3xl"
            style={{ animationDuration: "15s" }}
            aria-hidden="true"
          ></div>
          <div
            className="bg-primary/5 absolute bottom-1/4 left-[15%] h-[30rem] w-[30rem] animate-pulse rounded-full blur-3xl"
            style={{ animationDuration: "20s", animationDelay: "2s" }}
            aria-hidden="true"
          ></div>

          {/* Additional subtle elements */}
          <div
            className="bg-secondary/5 absolute top-[10%] left-[40%] h-[20rem] w-[20rem] animate-pulse rounded-full blur-2xl"
            style={{ animationDuration: "25s", animationDelay: "1s" }}
            aria-hidden="true"
          ></div>
          <div
            className="bg-secondary/5 absolute right-[10%] bottom-[15%] h-[15rem] w-[15rem] animate-pulse rounded-full blur-2xl"
            style={{ animationDuration: "18s", animationDelay: "3s" }}
            aria-hidden="true"
          ></div>
        </div>

        {/* Content container with subtle card-like styling */}
        <div className="container mx-auto max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
          <div className="bg-background/60 dark:bg-background/40 border-border/30 relative w-full rounded-xl border p-6 shadow-lg backdrop-blur-sm sm:p-8">
            {children}
          </div>
        </div>
      </main>

      <AuthFooter />
    </div>
  );
}
