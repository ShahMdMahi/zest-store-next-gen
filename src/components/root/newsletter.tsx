"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NewsletterProps {
  className?: string;
  buttonLabel?: string;
  showSheetView?: boolean;
}

export function Newsletter({
  className,
  buttonLabel = "Subscribe",
  showSheetView = false,
}: NewsletterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would handle the newsletter subscription here
    console.log(`Subscribing email: ${email}`);

    // Reset form and close sheet if in sheet view
    setEmail("");
    if (showSheetView) {
      setIsOpen(false);
    }
  };

  const newsletterForm = (
    <form className="flex flex-col gap-2 sm:flex-row" onSubmit={handleSubmit}>
      <Input
        type="email"
        placeholder="Your email address"
        className="h-9 rounded-md"
        required
        aria-label="Email for newsletter"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <Button type="submit" className="h-9 whitespace-nowrap">
        {buttonLabel}
      </Button>
    </form>
  );

  // If using sheet view, wrap with Sheet component
  if (showSheetView) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className={className}>
            Subscribe to Newsletter
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="p-6">
          <SheetHeader className="mb-4">
            <SheetTitle>Stay Updated</SheetTitle>
            <SheetDescription>
              Subscribe to our newsletter for the latest products, deals, and updates.
            </SheetDescription>
          </SheetHeader>
          <div className="mx-auto max-w-md">
            {newsletterForm}
            <div className="text-muted-foreground mt-4 flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 shrink-0" />
              <span>contact@zeststore.com</span>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // For embedded view (like in footer)
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-base font-medium">Stay Updated</h3>
      <p className="text-muted-foreground text-sm">
        Subscribe to our newsletter for the latest products, deals, and updates.
      </p>
      {newsletterForm}
      <div className="space-y-2 pt-2">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 shrink-0" />
          <span>contact@zeststore.com</span>
        </div>
      </div>
    </div>
  );
}

// For easy usage in mobile footer
export function MobileNewsletter() {
  return <Newsletter />;
}

// For sheet popup version that can be used anywhere
export function NewsletterPopup({ className }: { className?: string }) {
  return <Newsletter showSheetView={true} className={className} />;
}
