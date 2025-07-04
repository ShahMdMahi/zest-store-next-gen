import Link from "next/link";
import { Heart } from "lucide-react";

export function AuthFooter() {
  return (
    <footer className="border-border/40 bg-background/80 supports-[backdrop-filter]:bg-background/60 border-t px-4 py-4 backdrop-blur transition-all md:px-6">
      <div className="container mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 text-center md:flex-row md:justify-between md:text-left">
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Zest Store. All rights reserved.
          </p>
          <span className="text-muted-foreground hidden items-center md:flex">
            <Heart className="text-primary mx-1 h-3 w-3 animate-pulse" />
          </span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-2 text-sm sm:gap-4">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-md px-2 py-1 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/terms"
            className="text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-md px-2 py-1 transition-colors"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-md px-2 py-1 transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/contact"
            className="text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-md px-2 py-1 transition-colors"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
