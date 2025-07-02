"use client";

import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { ReactNode } from "react";

interface CartButtonProps {
  fallback?: ReactNode;
}

export function CartButton({ fallback }: CartButtonProps) {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0); // In a real application, this would come from your cart state or API
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch by waiting for client-side rendering
  useEffect(() => {
    setIsClient(true);
    // In a real app, you would fetch cart data here
    // Example: fetchCartData().then(data => setCartItemCount(data.items.length));
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
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium flex items-center justify-center text-primary-foreground">{cartItemCount}</span>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>{isEmpty ? "Your cart is empty" : `${cartItemCount} items in your cart`}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg mb-1">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground mb-6">Start adding items to your cart to see them here.</p>
              <Button asChild onClick={() => setCartOpen(false)} className="w-full sm:w-auto">
                <Link href="/">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            // This would be replaced with your actual cart items
            <div className="space-y-4 px-1">
              {/* Cart item example - In a real app you would map through cart items */}
              <div className="flex items-center gap-4 border-b pb-4">
                <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Example Product</h4>
                  <p className="text-sm text-muted-foreground">1 × $0.00</p>
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
          <SheetFooter className="flex-col gap-4 border-t pt-4 px-4">
            <div className="flex items-center justify-between w-full text-sm">
              <span>Subtotal</span>
              <span className="font-medium">$0.00</span>
            </div>
            <div className="flex items-center justify-between w-full text-sm">
              <span>Shipping</span>
              <span className="font-medium">Calculated at checkout</span>
            </div>
            <div className="flex items-center justify-between w-full text-base font-medium mt-2">
              <span>Total</span>
              <span>$0.00</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
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
