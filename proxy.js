// proxy.js — Next.js 16 (replaces middleware.js)
//
// KEY CHANGE: The old proxy called fetch(`${origin}/api/user?email=...`) to
// check registration. This was a loopback HTTP request that:
//   1. Sometimes hit the route before it had compiled → 404
//   2. Counted against the AbortSignal.timeout(2500) budget alongside
//      TLS + DNS + TCP overhead → frequent timeouts
//   3. Was redundant — the same data is available directly via getUserByEmail()
//
// The new proxy calls getUserByEmail() directly. It uses the same Redis
// cache layer that pages use, so there is no extra DB round-trip when the
// cache is warm. On a cache miss it runs one Prisma query — the same query
// the old HTTP path would have triggered, just without the HTTP overhead.

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserByEmail } from "@/action/user";

export default async function proxy(request) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = [/^\/users\/[^/]+\/edit$/, /^\/intervue(\/.*)?$/];
  const isProtectedRoute = protectedRoutes.some((p) => p.test(pathname));

  const session = await auth();
  const userPresent = request.cookies.get("user_present")?.value;
  const response = NextResponse.next();

  if (!session?.user?.email) {
    // ── Unauthenticated ───────────────────────────────────────────────────
    if (userPresent) response.cookies.delete("user_present", { path: "/" });
    if (
      pathname !== "/sign-in" &&
      (isProtectedRoute || pathname === "/register")
    ) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  } else {
    // ── Authenticated ─────────────────────────────────────────────────────
    if (!userPresent) {
      // Check registration directly — no HTTP round-trip.
      //
      // getUserByEmail(email, throwable=true) behaviour:
      //   • returns User object → user is registered
      //   • returns null        → user found by auth but not yet registered
      //   • throws              → Redis/DB error → fail open (don't redirect)
      let currentUser;
      let lookupFailed = false;

      try {
        currentUser = await getUserByEmail(session.user.email, true);
      } catch {
        // Any error (Redis timeout, Prisma error, etc.) → fail open so a
        // transient DB blip does not bounce a real registered user to /register.
        lookupFailed = true;
      }

      if (!lookupFailed) {
        if (currentUser) {
          // Registered — stamp the cookie for 24 h so subsequent requests
          // skip this check entirely.
          response.cookies.set("user_present", "true", {
            httpOnly: true,
            path: "/",
            maxAge: 86400, // 24 hours
            sameSite: "lax",
          });
        } else if (
          currentUser === null &&
          pathname !== "/register" &&
          pathname !== "/sign-out"
        ) {
          // Confirmed: authenticated but not yet registered.
          return NextResponse.redirect(new URL("/register", request.url));
        }
      }
    }
  }

  // Redirect already-registered users away from sign-in / register.
  if (userPresent && (pathname === "/register" || pathname === "/sign-in")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|icons|favicon.ico).*)"],
};
