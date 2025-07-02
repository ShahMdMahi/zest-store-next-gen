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
        <Button variant="ghost" size="icon" className={cn(`${buttonClasses} ${className}`, "relative overflow-hidden hover:bg-primary/5 transition-all duration-300")} aria-label="Search">
          <SearchIcon className="h-5 w-5 transition-transform hover:scale-110" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className={cn("h-auto pt-6 pb-8 px-4 rounded-b-xl border-t-0 shadow-lg", "bg-gradient-to-b from-background to-background/95 backdrop-blur-sm")}>
        <div className="absolute top-2 right-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10" onClick={() => setSearchOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <SheetHeader className="mb-5">
          <SheetTitle className="text-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Search Products</SheetTitle>
        </SheetHeader>

        <div className={cn("w-full max-w-2xl mx-auto transition-all duration-300", isAnimating ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4")}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex items-center gap-3 bg-background/50 p-1 rounded-xl border shadow-inner">
              <Input
                type="search"
                placeholder="Find what you're looking for..."
                className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 text-lg pl-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Button type="submit" className="rounded-lg bg-primary hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg">
                <SearchIcon className="h-4 w-4 mr-2" />
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
