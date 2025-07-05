import { Layers, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/common/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { RootNavbarMobile } from "@/components/root/navbar-mobile";
import { CartButton } from "@/components/root/cart-button";
import { ProfileButton } from "@/components/common/profile-button";
import { Search } from "@/components/root/search";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";

export async function RootNavbar() {
  const session = await auth();
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur transition-all">
      <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Mobile menu */}
          <RootNavbarMobile session={session} />

          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <div className="bg-primary/10 group-hover:bg-primary/20 flex h-8 w-8 items-center justify-center rounded-md transition-colors">
              <Layers className="text-primary h-5 w-5 transition-transform group-hover:scale-110" />
            </div>
            <span className="group-hover:text-primary inline-block text-lg font-semibold transition-colors">
              Zest Store
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 md:w-[400px] lg:w-[500px]">
                    {categories.map(category => (
                      <NavigationMenuLink
                        key={category.title}
                        asChild
                        className="hover:bg-accent hover:text-accent-foreground block space-y-1 rounded-md p-3 select-none"
                      >
                        <Link href={category.href}>
                          <div className="text-sm font-medium">{category.title}</div>
                          <p className="text-muted-foreground text-sm leading-snug">
                            {category.description}
                          </p>
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
                    className="group hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    Deals
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/new-arrivals"
                    className="group hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50"
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
                  <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium">
                    0
                  </span>
                </div>
              </Button>
            }
          />

          {/* Profile button - using the dedicated component */}
          <ProfileButton session={session} />

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
