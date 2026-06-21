import { createUser, getUserByEmail, updateUser } from "@/action/user";
import { NextResponse } from "next/server";

// BUGFIX: this file used to `import { connectDB } from "@/lib/db";` — but
// lib/db.ts only has a default export (the Prisma client), it never exported
// `connectDB`. That dead/broken import has been removed; Prisma's client
// manages its own connections lazily, no manual connect step is needed.
//
// BUGFIX: every response here used to come back with an implicit 200,
// success or failure — `NextResponse.json({error: "..."})` with no status
// option defaults to 200. The current client code only ever checks
// `data.error` in the body, so nothing was functionally broken, but any
// future API consumer (or even just browser devtools / curl while
// debugging) would have no way to tell a failed request from a successful
// one without parsing the body. Added real status codes without changing
// the response body shape, so existing callers keep working unchanged.

export async function POST(request) {
  try {
    const data = await request.json();
    const user = await createUser(data, true);
    return NextResponse.json({ user }, { status: 201 }); // 201 Created
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error.message ||
          "An unexpected error occurred. Please try again later.",
      },
      { status: 400 },
    );
  }
}

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Missing required 'email' query parameter." },
        { status: 400 },
      );
    }

    // A null `user` here is a valid, expected state (authenticated but not
    // registered yet) — not an error — so it stays a 200 with `user: null`,
    // exactly as before.
    const user = await getUserByEmail(email, true);
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error.message ||
          "An unexpected error occurred. Please try again later.",
      },
      { status: 400 },
    );
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const user = await updateUser(data, true);
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error.message ||
          "An unexpected error occurred. Please try again later.",
      },
      { status: 400 },
    );
  }
}
