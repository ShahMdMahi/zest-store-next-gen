"use client";

import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { ReactNode } from "react";

interface CartButtonProps {
  fallback?: ReactNode;
}

export function CartButton({ fallback }: CartButtonProps) {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItemCount] = useState(0); // In a real application, this would come from your cart state or API
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch by waiting for client-side rendering
  useEffect(() => {
    setIsClient(true);
    // In a real app, you would fetch cart data here
    // Example: fetchCartData().then(data => _(data.items.length));
  }, []);

  // Example empty cart state - in a real app you'd integrate with your cart system
  const isEmpty = cartItemCount === 0;

  if (!isClient) {
    return null; // Or a skeleton placeholder
  }

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetTrigger asChild>
        {fallback || (
          <Button variant="ghost" size="icon" aria-label="Shopping cart" className="relative">
            <ShoppingBag className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium">
                {cartItemCount}
              </span>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>
            {isEmpty ? "Your cart is empty" : `${cartItemCount} items in your cart`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6">
          {isEmpty ? (
            <div className="flex h-full flex-col items-center justify-center px-4 text-center">
              <ShoppingBag className="text-muted-foreground mb-4 h-16 w-16" />
              <h3 className="mb-1 text-lg font-medium">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6 text-sm">
                Start adding items to your cart to see them here.
              </p>
              <Button asChild onClick={() => setCartOpen(false)} className="w-full sm:w-auto">
                <Link href="/">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            // This would be replaced with your actual cart items
            <div className="space-y-4 px-1">
              {/* Cart item example - In a real app you would map through cart items */}
              <div className="flex items-center gap-4 border-b pb-4">
                <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-md">
                  <ShoppingBag className="text-muted-foreground h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">Example Product</h4>
                  <p className="text-muted-foreground text-sm">1 × $0.00</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <span className="sr-only">Remove</span>
                  <span aria-hidden className="text-lg">
                    ×
                  </span>
                </Button>
              </div>
            </div>
          )}
        </div>

        {!isEmpty && (
          <SheetFooter className="flex-col gap-4 border-t px-4 pt-4">
            <div className="flex w-full items-center justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-medium">$0.00</span>
            </div>
            <div className="flex w-full items-center justify-between text-sm">
              <span>Shipping</span>
              <span className="font-medium">Calculated at checkout</span>
            </div>
            <div className="mt-2 flex w-full items-center justify-between text-base font-medium">
              <span>Total</span>
              <span>$0.00</span>
            </div>

            <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
              <Button variant="outline" onClick={() => setCartOpen(false)}>
                Continue Shopping
              </Button>
              <Button>Checkout</Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
