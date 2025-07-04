import Link from "next/link";
import { Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RootFooterMobile } from "@/components/root/footer-mobile";
import { Newsletter } from "@/components/root/newsletter";

export function RootFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-border/40 bg-background/80 supports-[backdrop-filter]:bg-background/60 border-t backdrop-blur transition-all">
      {/* Main footer content */}
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        {/* Mobile Footer */}
        <RootFooterMobile />

        {/* Desktop Footer */}
        <div className="hidden grid-cols-4 gap-8 md:gap-12 lg:grid">
          {/* Column 1: About */}
          <div className="space-y-4">
            <DesktopFooterAbout />
          </div>

          {/* Column 2: Shop Categories */}
          <div className="space-y-4">
            <h3 className="text-base font-medium">Shop by Category</h3>
            <FooterCategoryLinks />
          </div>

          {/* Column 3: Customer Service */}
          <div className="space-y-4">
            <h3 className="text-base font-medium">Customer Service</h3>
            <FooterServiceLinks />
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <Newsletter />
            <div className="space-y-2 pt-2">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>123 Commerce St, City, Country</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="border-border/40 border-t py-4">
        <div className="container mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-4 text-center md:flex-row md:justify-between md:text-left">
          <p className="text-muted-foreground order-2 text-sm md:order-1">
            &copy; {currentYear} Zest Store. All rights reserved.
          </p>
          <nav className="order-1 flex flex-wrap items-center justify-center gap-2 text-sm sm:gap-4 md:order-2">
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
              href="/cookie-policy"
              className="text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-md px-2 py-1 transition-colors"
            >
              Cookies
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-md px-2 py-1 transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function DesktopFooterAbout() {
  return (
    <>
      <Link href="/" className="group flex items-center gap-2">
        <div className="bg-primary/10 group-hover:bg-primary/20 flex h-8 w-8 items-center justify-center rounded-md transition-colors">
          <Layers className="text-primary h-5 w-5 transition-transform group-hover:scale-110" />
        </div>
        <span className="group-hover:text-primary inline-block text-lg font-semibold transition-colors">
          Zest Store
        </span>
      </Link>
      <p className="text-muted-foreground text-sm">
        Discover the finest selection of products at Zest Store. Quality, style, and value - all in
        one place.
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
    </>
  );
}

function FooterCategoryLinks() {
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

function FooterServiceLinks() {
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
