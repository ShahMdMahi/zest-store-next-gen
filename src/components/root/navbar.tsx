import { Layers, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { RootNavbarMobile } from "@/components/root/navbar-mobile";
import { CartButton } from "@/components/root/cart-button";
import { ProfileButton } from "@/components/common/profile-button";
import { Search } from "@/components/root/search";
import { Button } from "@/components/ui/button";

export function RootNavbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-all">
      <div className="container max-w-7xl mx-auto px-4 py-3 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Mobile menu */}
          <RootNavbarMobile />

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Layers className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-semibold text-lg inline-block group-hover:text-primary transition-colors">Zest Store</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] grid-cols-1 sm:grid-cols-2">
                    {categories.map((category) => (
                      <NavigationMenuLink key={category.title} asChild className="block select-none space-y-1 rounded-md p-3 hover:bg-accent hover:text-accent-foreground">
                        <Link href={category.href}>
                          <div className="text-sm font-medium">{category.title}</div>
                          <p className="text-sm leading-snug text-muted-foreground">{category.description}</p>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/deals"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    Deals
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/new-arrivals"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    New Arrivals
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
          {/* Search button using the dedicated component */}
          <Search />

          {/* Cart button - using the dedicated component or fallback */}
          <CartButton
            fallback={
              <Button variant="ghost" size="icon" aria-label="Shopping cart">
                <div className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium flex items-center justify-center text-primary-foreground">0</span>
                </div>
              </Button>
            }
          />

          {/* Profile button - using the dedicated component */}
          <ProfileButton />

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

const categories = [
  {
    title: "Electronics",
    description: "Smartphones, laptops, and the latest tech gadgets",
    href: "/category/electronics",
  },
  {
    title: "Home & Kitchen",
    description: "Furniture, appliances, and decor for your space",
    href: "/category/home",
  },
  {
    title: "Fashion",
    description: "Clothing, shoes, and accessories for all styles",
    href: "/category/fashion",
  },
  {
    title: "Beauty",
    description: "Skincare, makeup, and personal care products",
    href: "/category/beauty",
  },
];
