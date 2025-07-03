"use client";

import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ProfileButton } from "@/components/common/profile-button";
import { MobileSearch } from "@/components/root/search";

export function RootNavbarMobile() {
  const [open, setOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="flex md:hidden">
        <Button variant="ghost" size="icon" aria-label="Menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80vw] max-w-xs p-0 pt-10">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex flex-col h-full">
          <div className="px-4 mb-2 flex justify-end">
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Menu Items */}
          <div className="flex-1 px-4 py-2 overflow-y-auto">
            <div className="space-y-1">
              <Collapsible
                open={categoryOpen}
                onOpenChange={setCategoryOpen}
                className="w-full"
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between">
                    Products
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${categoryOpen ? "transform rotate-180" : ""}`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 space-y-1">
                  {categories.map((category) => (
                    <Button
                      key={category.title}
                      variant="ghost"
                      className="w-full justify-start text-left"
                      onClick={() => {
                        setOpen(false);
                        setCategoryOpen(false);
                      }}
                      asChild
                    >
                      <Link href={category.href}>
                        <span>{category.title}</span>
                      </Link>
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setOpen(false)}
                asChild
              >
                <Link href="/deals">Deals</Link>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setOpen(false)}
                asChild
              >
                <Link href="/new-arrivals">New Arrivals</Link>
              </Button>

              {/* Search Component instead of Link */}
              <div className="w-full py-1">
                <MobileSearch />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="px-2">
                <ProfileButton
                  isMobile={true}
                  onMobileNavClose={() => setOpen(false)}
                />
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

const categories = [
  {
    title: "Electronics",
    href: "/category/electronics",
  },
  {
    title: "Home & Kitchen",
    href: "/category/home",
  },
  {
    title: "Fashion",
    href: "/category/fashion",
  },
  {
    title: "Beauty",
    href: "/category/beauty",
  },
];
