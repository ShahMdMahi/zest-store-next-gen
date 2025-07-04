import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { logger } from "@/lib/logger";

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;

  // Get the session from the server
  const session = await auth();
  const isAuthenticated = !!session?.user;
  console.log("Session:", session);

  // Admin routes that require admin role
  const isAdminRoute = pathname.startsWith("/admin");

  // Protected routes that require authentication
  const isProtectedRoute =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/account") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/dashboard");

  logger.debug("Middleware request:", {
    isAuthenticated,
    isAdminRoute,
    isProtectedRoute,
    url: pathname,
  });

  // Redirect authenticated users away from auth pages (login/register)
  if (isAuthenticated && pathname.startsWith("/auth/")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect unauthenticated users to login for protected routes
  if (!isAuthenticated && isProtectedRoute) {
    const redirectUrl = new URL("/auth/login", request.url);
    redirectUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect non-admin users away from admin routes
  if (isAuthenticated && isAdminRoute && session.user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Continue for all other cases
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files
    "/((?!api|_next/static|_next/image|_next/font|favicon.ico).*)",
    // Protected routes
    "/profile/:path*",
    "/admin/:path*",
    "/auth/:path*",
  ],
};
