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
      include: {
        experience: true,
        projects: true,
        education: true,
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

    // Handle experience updates or creates
    const existingExperience = user.experience;
    const newExperience = data.experience;

    const experienceToDelete = existingExperience.filter(
      (exp) =>
        !newExperience.some(
          (newExp) =>
            newExp.company === exp.company && newExp.position === exp.position
        )
    );

    for (const exp of experienceToDelete) {
      await prisma.experience.delete({
        where: {
          id: exp.id,
        },
      });
    }

    for (const exp of newExperience) {
      await prisma.experience.upsert({
        where: {
          userId_company_position: {
            userId: user.id,
            company: exp.company,
            position: exp.position,
          },
        },
        update: {
          start: exp.start,
          end: exp.end,
          about: exp.about,
        },
        create: {
          userId: user.id,
          company: exp.company,
          position: exp.position,
          start: exp.start,
          end: exp.end,
          about: exp.about,
        },
      });
    }

    // Handle project updates or creates
    const existingProjects = user.projects;
    const newProjects = data.projects;

    const projectsToDelete = existingProjects.filter(
      (project) =>
        !newProjects.some((newProject) => newProject.name === project.name)
    );

    for (const project of projectsToDelete) {
      await prisma.project.delete({
        where: {
          id: project.id,
        },
      });
    }

    for (const project of newProjects) {
      await prisma.project.upsert({
        where: {
          userId_name: {
            userId: user.id,
            name: project.name,
          },
        },
        update: {
          code_url: project.code_url,
          live_url: project.live_url,
          skills: { set: project.skills },
          about: project.about,
        },
        create: {
          userId: user.id,
          name: project.name,
          code_url: project.code_url,
          live_url: project.live_url,
          skills: { set: project.skills },
          about: project.about,
        },
      });
    }

    // Handle education updates or creates
    const existingEducation = user.education;
    const newEducation = data.education;

    const educationToDelete = existingEducation.filter(
      (edu) => !newEducation.some((newEdu) => newEdu.degree === edu.degree)
    );

    for (const edu of educationToDelete) {
      await prisma.education.delete({
        where: {
          id: edu.id,
        },
      });
    }

    for (const edu of newEducation) {
      await prisma.education.upsert({
        where: {
          userId_degree: {
            userId: user.id,
            degree: edu.degree,
          },
        },
        update: {
          college: edu.college,
          specialization: edu.specialization,
          score: edu.score,
          start: edu.start,
          end: edu.end,
        },
        create: {
          userId: user.id,
          college: edu.college,
          degree: edu.degree,
          specialization: edu.specialization,
          score: edu.score,
          start: edu.start,
          end: edu.end,
        },
      });
    }

    // Update other user details (like profiles, skills, etc.)
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
        achievements: data.achievements,
        profiles: data.profiles,
        skills: { set: data.skills },
      },
      include: {
        projects: true,
        education: true,
        experience: true,
      },
    });

    if (!updatedUser)
      throw new Error("Internal Server Error: Failed to update user.");

    return updatedUser;
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
