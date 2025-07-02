import { Layers } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/common/theme-toggle";

export function AuthNavbar() {
  return (
    <header className="sticky top-0 z-40 w-full flex items-center justify-between py-3 px-4 md:px-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-all">
      <div className="container max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Layers className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
          </div>
          <span className="font-semibold text-lg inline-block group-hover:text-primary transition-colors">Zest Store</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Sign In
          </Link>
          <Link href="/auth/register" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Sign Up
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
