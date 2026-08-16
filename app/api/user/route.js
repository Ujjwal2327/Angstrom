// app/api/user/route.js
import { createUser, getUserByEmail, updateUser } from "@/action/user";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Shared no-cache headers — user data must never be served stale.
const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
  "CDN-Cache-Control": "no-store",
};

export async function POST(request) {
  try {
    // BUGFIX (security): previously trusted `email` straight from the
    // request body, so anyone could POST an arbitrary email/username and
    // create a user record for an identity they don't control. `email` now
    // always comes from the verified server-side session, never the body.
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be signed in to do this." },
        { status: 401, headers: NO_CACHE },
      );
    }

    const body = await request.json();
    const user = await createUser({ ...body, email: session.user.email }, true);
    return NextResponse.json({ user }, { status: 201, headers: NO_CACHE });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 400, headers: NO_CACHE },
    );
  }
}

export async function GET(request) {
  try {
    const email = request.nextUrl.searchParams.get("email");
    if (!email) {
      return NextResponse.json(
        { error: "Missing required 'email' query parameter." },
        { status: 400, headers: NO_CACHE },
      );
    }
    const user = await getUserByEmail(email, true);
    return NextResponse.json({ user }, { headers: NO_CACHE });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 400, headers: NO_CACHE },
    );
  }
}

export async function PUT(request) {
  try {
    // BUGFIX (security): previously trusted `email` straight from the
    // request body as the lookup key for which user to update, so anyone
    // could PUT a different user's `email` and overwrite that user's
    // profile. `email` now always comes from the verified server-side
    // session, overriding whatever the client sent.
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be signed in to do this." },
        { status: 401, headers: NO_CACHE },
      );
    }

    const body = await request.json();
    const user = await updateUser({ ...body, email: session.user.email }, true);
    return NextResponse.json({ user }, { headers: NO_CACHE });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 400, headers: NO_CACHE },
    );
  }
}
