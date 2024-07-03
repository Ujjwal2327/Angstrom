import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();
    const user = await createUser(data);
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error in creating user: ");
    if (process.env.NODE_ENV === "production") console.error(error);
    return NextResponse.json({
      error:
        error.message ||
        "An unexpected error occurred. Please try again later.",
    });
  }
}

async function createUser(data) {
  const prisma = connectDB();

  try {
    const userExists = await prisma.user.findUnique({
      where: {
        username: data.username,
      },
    });
    if (userExists)
      throw new Error(
        "Username already exists. Please choose a different username."
      );

    data.firstname = data.firstname || "";
    data.lastname = data.lastname || "";
    const newUser = await prisma.user.create({
      data,
    });

    await prisma.$disconnect();

    if (!newUser)
      throw new Error("Internal Server Error: Failed to create user.");

    return newUser;
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}