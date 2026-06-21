import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Returns:
//   - the user object, if found
//   - null, if the lookup *succeeded* and confirmed the user isn't registered yet
//   - undefined, if the lookup itself failed (network/DB blip) — distinct from
//     "confirmed not registered" so the caller can fail open instead of
//     bouncing an already-registered user to /register or crashing the site.
async function fetchUser(session, baseUrl) {
  try {
    const response = await fetch(
      `${baseUrl}/api/user?email=${encodeURIComponent(session.user.email)}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.user || null;
  } catch (error) {
    console.error("Error in fetching user in middleware:", error.message);
    return undefined;
  }
}

export async function middleware(request) {
  const { pathname, origin } = request.nextUrl;
  const protectedRoutes = [
    /^\/users\/[^/]+\/edit$/, // Matches /users/[username]/edit
    /^\/intervue(\/.*)?$/, // Matches /intervue and all sub-paths under it
  ];
  const isProtectedRoute = protectedRoutes.some((routePattern) =>
    routePattern.test(pathname),
  );

  // Check if user is authenticated
  const session = await auth();

  // Retrieve user presence status from cookies
  let userPresent = request.cookies.get("user_present")?.value;

  const response = NextResponse.next();

  if (!session?.user?.email) {
    // User is not authenticated
    if (userPresent) {
      response.cookies.delete("user_present", { path: "/" });
    }

    // Redirect to sign-in if user is not authenticated and trying to access a protected page
    if (
      pathname !== "/sign-in" &&
      (isProtectedRoute || pathname === "/register")
    ) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  } else {
    // User is authenticated
    if (!userPresent) {
      const currentUser = await fetchUser(session, origin);

      if (currentUser) {
        response.cookies.set("user_present", "true", {
          httpOnly: true,
          path: "/",
          maxAge: 3600, // Set cookie expiration (1 hour)
        });
      } else if (
        currentUser === null &&
        pathname !== "/register" &&
        pathname !== "/sign-out"
      ) {
        // Lookup succeeded and confirmed: authenticated but not registered yet.
        return NextResponse.redirect(new URL("/register", request.url));
      }
      // BUGFIX: previously, ANY error here (including a transient fetch
      // failure) was caught by an outer try/catch that returned
      // `new NextResponse(error.message, { status: 500 })` — taking down
      // every single page for that user until the next request happened to
      // succeed. Now a failed lookup (currentUser === undefined) just lets
      // the request through unchanged ("fail open") instead of crashing the
      // whole app or wrongly bouncing a real, registered user to /register.
    }
  }

  // Redirect logged-in users away from register or sign-in pages
  if (userPresent && (pathname === "/register" || pathname === "/sign-in")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|icons|favicon.ico).*)", // Protects all other routes, excluding specific paths
  ],
};
