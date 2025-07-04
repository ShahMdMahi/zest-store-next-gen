import { Layers } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/common/theme-toggle";

export function AuthNavbar() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40 flex w-full items-center justify-between border-b px-4 py-3 backdrop-blur transition-all md:px-6">
      <div className="container mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="group flex items-center gap-2">
          <div className="bg-primary/10 group-hover:bg-primary/20 flex h-8 w-8 items-center justify-center rounded-md transition-colors">
            <Layers className="text-primary h-5 w-5 transition-transform group-hover:scale-110" />
          </div>
          <span className="group-hover:text-primary inline-block text-lg font-semibold transition-colors">
            Zest Store
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/auth/login"
            className="text-muted-foreground hover:text-foreground hidden text-sm font-medium transition-colors sm:block"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="text-muted-foreground hover:text-foreground hidden text-sm font-medium transition-colors sm:block"
          >
            Sign Up
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
