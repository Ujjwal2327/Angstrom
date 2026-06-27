// app/api/user/route.js
import { createUser, getUserByEmail, updateUser } from "@/action/user";
import { NextResponse } from "next/server";

// Shared no-cache headers — user data must never be served stale.
const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
  "CDN-Cache-Control": "no-store",
};

export async function POST(request) {
  try {
    const data = await request.json();
    const user = await createUser(data, true);
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
    const data = await request.json();
    const user = await updateUser(data, true);
    return NextResponse.json({ user }, { headers: NO_CACHE });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 400, headers: NO_CACHE },
    );
  }
}
