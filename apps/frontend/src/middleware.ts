import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that require user authentication
const PROTECTED_ROUTES = [
  "/checkout",
  "/account",
  "/wishlist",
];

// Routes for guests only (redirect to /account if already logged in)
const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
];

export async function middleware(req: NextRequest) {
  try {
    const { pathname, search } = req.nextUrl;

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || "unseen-gadget-nextauth-secret-key-32-chars-long-secure-2026",
    });

    const isAuthenticated = Boolean(token);

    // 1. Guard protected routes: redirect unauthenticated users to login with callbackUrl
    const isProtected = PROTECTED_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    if (isProtected && !isAuthenticated) {
      const callbackUrl = encodeURIComponent(`${pathname}${search}`);
      const loginUrl = new URL(`/login?callbackUrl=${callbackUrl}`, req.url);
      return NextResponse.redirect(loginUrl);
    }

    // 2. Guard auth routes: redirect already authenticated users away from login/register
    const isAuthRoute = AUTH_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    if (isAuthRoute && isAuthenticated) {
      return NextResponse.redirect(new URL("/account", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Middleware error:", err);
    return NextResponse.next();
  }
}

export const proxy = middleware;

export const config = {
  matcher: [
    "/checkout/:path*",
    "/account/:path*",
    "/wishlist/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
