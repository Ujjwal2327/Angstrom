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

    if (!newUser)
      throw new Error("Internal Server Error: Failed to create user.");
    return newUser;
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");
    const user = await getUserByEmail(email);
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error in fetching user: ");
    if (process.env.NODE_ENV === "production") console.error(error);
    return NextResponse.json({
      error:
        error.message ||
        "An unexpected error occurred. Please try again later.",
    });
  }
}

async function getUserByEmail(email) {
  const prisma = connectDB();

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const user = await updateUser(data);
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error in updating user: ");
    if (process.env.NODE_ENV === "production") console.error(error);
    return NextResponse.json({
      error:
        error.message ||
        "An unexpected error occurred. Please try again later.",
    });
  }
}

async function updateUser(data) {
  const prisma = connectDB();

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) throw new Error("User not found.");

    if (user.username !== data.username) {
      const sameUsernameUser = await prisma.user.findUnique({
        where: {
          username: data.username,
        },
      });
      if (sameUsernameUser) throw new Error("Username already exists.");
    }

    const updatedUser = await prisma.user.update({
      where: {
        email: data.email,
      },
      data: {
        username: data.username,
        firstname: data.firstname,
        lastname: data.lastname,
        pic: data.pic,
        about: data.about,
        profiles: data.profiles,
        skills: { set: data.skills },
        projects: {
          deleteMany: {},
          create: data.projects.map((project) => ({
            name: project.name,
            code_url: project.code_url,
            live_url: project.live_url,
            skills: { set: project.skills },
            about: project.about,
          })),
        },
        education: {
          deleteMany: {},
          create: data.education.map((edu) => ({
            college: edu.college,
            degree: edu.degree,
            specialization: edu.specialization,
            score: edu.score,
            start: edu.start,
            end: edu.end,
          })),
        },
        experience: {
          deleteMany: {},
          create: data.experience.map((exp) => ({
            company: exp.company,
            position: exp.position,
            start: exp.start,
            end: exp.end,
            about: exp.about,
          })),
        },
      },
      include: {
        projects: true,
        education: true,
        experience: true,
      },
    });

    if (!updatedUser)
      throw new Error("Internal Server Error: Failed to update user.");

    const finalUser = JSON.parse(JSON.stringify(updatedUser, null, 2)); // used JSON.stringify to view nested objects, use JSON.parse to send json in frontend - otherwise giving projects, education and esperience as "[Object]" and not giving actual values
    return finalUser;
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
