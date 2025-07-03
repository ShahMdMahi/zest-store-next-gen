import Link from "next/link";
import {
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RootFooterMobile } from "@/components/root/footer-mobile";
import { Newsletter } from "@/components/root/newsletter";

export function RootFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all">
      {/* Main footer content */}
      <div className="container max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Mobile Footer */}
        <RootFooterMobile />

        {/* Desktop Footer */}
        <div className="hidden lg:grid grid-cols-4 gap-8 md:gap-12">
          {/* Column 1: About */}
          <div className="space-y-4">
            <DesktopFooterAbout />
          </div>

          {/* Column 2: Shop Categories */}
          <div className="space-y-4">
            <h3 className="font-medium text-base">Shop by Category</h3>
            <FooterCategoryLinks />
          </div>

          {/* Column 3: Customer Service */}
          <div className="space-y-4">
            <h3 className="font-medium text-base">Customer Service</h3>
            <FooterServiceLinks />
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <Newsletter />
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>123 Commerce St, City, Country</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="border-t border-border/40 py-4">
        <div className="container max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center md:justify-between text-center md:text-left gap-4">
          <p className="text-sm text-muted-foreground order-2 md:order-1">
            &copy; {currentYear} Zest Store. All rights reserved.
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-sm order-1 md:order-2">
            <Link
              href="/terms"
              className="px-2 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="px-2 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/cookie-policy"
              className="px-2 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
            >
              Cookies
            </Link>
            <Link
              href="/contact"
              className="px-2 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
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
      <Link href="/" className="flex items-center gap-2 group">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <Layers className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
        </div>
        <span className="font-semibold text-lg inline-block group-hover:text-primary transition-colors">
          Zest Store
        </span>
      </Link>
      <p className="text-sm text-muted-foreground">
        Discover the finest selection of products at Zest Store. Quality, style,
        and value - all in one place.
      </p>
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <Link
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <Facebook className="h-4 w-4" />
            <span className="sr-only">Facebook</span>
          </Button>
        </Link>
        <Link
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <Twitter className="h-4 w-4" />
            <span className="sr-only">Twitter</span>
          </Button>
        </Link>
        <Link
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <Instagram className="h-4 w-4" />
            <span className="sr-only">Instagram</span>
          </Button>
        </Link>
        <Link
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
        >
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
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Electronics
        </Link>
      </li>
      <li>
        <Link
          href="/category/home"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Home & Kitchen
        </Link>
      </li>
      <li>
        <Link
          href="/category/fashion"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Fashion
        </Link>
      </li>
      <li>
        <Link
          href="/category/beauty"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Beauty
        </Link>
      </li>
      <li>
        <Link
          href="/deals"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Help Center
        </Link>
      </li>
      <li>
        <Link
          href="/orders"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Order Tracking
        </Link>
      </li>
      <li>
        <Link
          href="/returns"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Returns & Refunds
        </Link>
      </li>
      <li>
        <Link
          href="/shipping"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Shipping Policy
        </Link>
      </li>
      <li>
        <Link
          href="/faq"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          FAQ
        </Link>
      </li>
    </ul>
  );
}
