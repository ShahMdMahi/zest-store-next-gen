import Link from "next/link";
import { Heart } from "lucide-react";

export function AuthFooter() {
  return (
    <footer className="py-4 px-4 md:px-6 border-t border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all">
      <div className="container max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center md:justify-between text-center md:text-left gap-4">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Zest Store. All rights reserved.</p>
          <span className="hidden md:flex items-center text-muted-foreground">
            <Heart className="h-3 w-3 text-primary mx-1 animate-pulse" />
          </span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-sm">
          <Link href="/" className="px-2 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors">
            Home
          </Link>
          <Link href="/terms" className="px-2 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors">
            Terms
          </Link>
          <Link href="/privacy" className="px-2 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors">
            Privacy
          </Link>
          <Link href="/contact" className="px-2 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
