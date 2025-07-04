"use client";

import { useState, useEffect } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SearchProps {
  className?: string;
  mobileOnly?: boolean;
}

export function Search({ className, mobileOnly = false }: SearchProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  // Handle animation states when opening/closing the search
  useEffect(() => {
    if (searchOpen) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, you would handle the search here
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const buttonClasses = mobileOnly ? "md:hidden flex" : "hidden sm:flex";

  return (
    <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            `${buttonClasses} ${className}`,
            "hover:bg-primary/5 relative overflow-hidden transition-all duration-300"
          )}
          aria-label="Search"
        >
          <SearchIcon className="h-5 w-5 transition-transform hover:scale-110" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="top"
        className={cn(
          "h-auto rounded-b-xl border-t-0 px-4 pt-6 pb-8 shadow-lg",
          "from-background to-background/95 bg-gradient-to-b backdrop-blur-sm"
        )}
      >
        <div className="absolute top-2 right-2">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary/10 h-8 w-8 rounded-full"
            onClick={() => setSearchOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <SheetHeader className="mb-5">
          <SheetTitle className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-center text-2xl font-bold text-transparent">
            Search Products
          </SheetTitle>
        </SheetHeader>

        <div
          className={cn(
            "mx-auto w-full max-w-2xl transition-all duration-300",
            isAnimating ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          )}
        >
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="bg-background/50 flex items-center gap-3 rounded-xl border p-1 shadow-inner">
              <Input
                type="search"
                placeholder="Find what you're looking for..."
                className="flex-1 border-0 bg-transparent pl-4 text-lg shadow-none focus-visible:ring-0"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <SearchIcon className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function MobileSearch() {
  return <Search mobileOnly={true} />;
}
