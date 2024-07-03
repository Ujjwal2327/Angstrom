import { NextResponse } from "next/server";
// import { auth } from "@/auth";
// import { getUserByEmail } from "./action/user";

export async function middleware(request) {
  // const session = await auth();
  // if (session?.user?.email) {
  //   const user = await getUserByEmail(session.user.email);
  //   console.log("SESSION: ", session);
  //   console.log("USER: ", user);
  //   if (!user) return NextResponse.redirect(new URL("/register", request.url));
  // }
  const headers = new Headers(request.headers);
  headers.set("x-current-path", request.nextUrl.pathname);
  return NextResponse.next({ headers });
}

export const config = {
  // matcher: ["/"],
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
