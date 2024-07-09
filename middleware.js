import { NextResponse } from "next/server";
import { auth } from "@/auth";

let user = null;

export async function middleware(request) {
  // check if user is signed in using google auth but not register in db
  const skipPages = ["/sign-out", "/register"];
  const pathname = request.nextUrl.pathname;
  if (skipPages.includes(pathname)) return NextResponse.next();

  const session = await auth();
  if (session?.user?.email && !user) {
    console.log("db call");
    try {
      const baseUrl = request.nextUrl.origin;
      const response = await fetch(
        `${baseUrl}/api/user?email=${encodeURIComponent(session.user.email)}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("user in middleware: ", data.user);
      if (data.error) throw new Error(data.error);
      if (data.user) {
        user = data.user;
      } else if (!data.user && request.nextUrl.pathname !== "/register") {
        return NextResponse.redirect(new URL("/register", request.url));
      }
    } catch (error) {
      console.log("Error in fetching user in middleware:", error.message);
      return new NextResponse("Internal Server Error. Please try again.", {
        status: 500,
      });
    }
  }

  const headers = new Headers(request.headers);
  headers.set("x-current-path", request.nextUrl.pathname);
  return NextResponse.next({ headers });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
