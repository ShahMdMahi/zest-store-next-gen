"use client";

import { useState } from "react";
import Link from "next/link";
import { Layers, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MobileNewsletter } from "@/components/root/newsletter";

export function RootFooterMobile() {
  const [openCategories, setOpenCategories] = useState(false);
  const [openCustomerService, setOpenCustomerService] = useState(false);

  return (
    <div className="space-y-8 lg:hidden">
      {/* About Section */}
      <div className="space-y-4">
        <Link href="/" className="group flex items-center gap-2">
          <div className="bg-primary/10 group-hover:bg-primary/20 flex h-8 w-8 items-center justify-center rounded-md transition-colors">
            <Layers className="text-primary h-5 w-5 transition-transform group-hover:scale-110" />
          </div>
          <span className="group-hover:text-primary inline-block text-lg font-semibold transition-colors">
            Zest Store
          </span>
        </Link>
        <p className="text-muted-foreground text-sm">
          Discover the finest selection of products at Zest Store. Quality, style, and value - all
          in one place.
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Facebook className="h-4 w-4" />
              <span className="sr-only">Facebook</span>
            </Button>
          </Link>
          <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </Button>
          </Link>
          <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Instagram className="h-4 w-4" />
              <span className="sr-only">Instagram</span>
            </Button>
          </Link>
          <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Categories Section - Collapsible */}
      <div className="border-t pt-4">
        <Collapsible open={openCategories} onOpenChange={setOpenCategories} className="w-full">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex h-auto w-full justify-between p-0">
              <h3 className="text-base font-medium">Shop by Category</h3>
              <span className="text-xl">{openCategories ? "−" : "+"}</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-2">
            <MobileFooterCategoryLinks />
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Customer Service Section - Collapsible */}
      <div className="border-t pt-4">
        <Collapsible
          open={openCustomerService}
          onOpenChange={setOpenCustomerService}
          className="w-full"
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex h-auto w-full justify-between p-0">
              <h3 className="text-base font-medium">Customer Service</h3>
              <span className="text-xl">{openCustomerService ? "−" : "+"}</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-2">
            <MobileFooterServiceLinks />
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Newsletter Section */}
      <div className="border-t pt-4">
        <MobileNewsletter />
      </div>
    </div>
  );
}

function MobileFooterCategoryLinks() {
  return (
    <ul className="space-y-2">
      <li>
        <Link
          href="/category/electronics"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          Electronics
        </Link>
      </li>
      <li>
        <Link
          href="/category/home"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          Home & Kitchen
        </Link>
      </li>
      <li>
        <Link
          href="/category/fashion"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          Fashion
        </Link>
      </li>
      <li>
        <Link
          href="/category/beauty"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          Beauty
        </Link>
      </li>
      <li>
        <Link
          href="/deals"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          Deals & Promotions
        </Link>
      </li>
    </ul>
  );
}

function MobileFooterServiceLinks() {
  return (
    <ul className="space-y-2">
      <li>
        <Link
          href="/help"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          Help Center
        </Link>
      </li>
      <li>
        <Link
          href="/orders"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          Order Tracking
        </Link>
      </li>
      <li>
        <Link
          href="/returns"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          Returns & Refunds
        </Link>
      </li>
      <li>
        <Link
          href="/shipping"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          Shipping Policy
        </Link>
      </li>
      <li>
        <Link
          href="/faq"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          FAQ
        </Link>
      </li>
    </ul>
  );
}
