import { connectDB } from "@/lib/db";
import { handleRedisOperation } from "@/lib/redis";
import { handleActionError, handleCaughtActionError } from "@/utils";

// return is used with handleActionError to ensure that the function immediately exits after the error handling logic has been applied.

export async function getUserByEmail(email, throwable = false) {
  if (!email || !email.trim())
    return handleActionError("Invalid email provided.", throwable, null);

  const prisma = connectDB();
  try {
    const cacheUser = await handleRedisOperation("get", `email:${email}`);
    if (cacheUser) return JSON.parse(cacheUser);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        projects: true,
        education: true,
        experience: true,
      },
    });

    if (!user) return null;

    await handleRedisOperation("set", `username:${user.username}`, user.email);
    await handleRedisOperation(
      "set",
      `email:${user.email}`,
      JSON.stringify(user)
    );

    return user;
  } catch (error) {
    handleCaughtActionError(
      "Error in fetching user",
      error.message,
      throwable,
      null
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function getAllUsers(throwable = false) {
  const prisma = connectDB();
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    handleCaughtActionError(
      "Error in fetching users",
      error.message,
      throwable,
      []
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function getUserByUsername(username, throwable = false) {
  if (!username || !username?.trim())
    return handleActionError("Invalid username provided.", throwable, null);

  const prisma = connectDB();
  try {
    const cacheEmail = await handleRedisOperation(
      "get",
      `username:${username}`
    );

    const cacheUser = cacheEmail
      ? await handleRedisOperation("get", `email:${cacheEmail}`)
      : null;

    if (cacheUser) return JSON.parse(cacheUser);

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        projects: true,
        education: true,
        experience: true,
      },
    });

    if (!user) return null;

    await handleRedisOperation("set", `username:${user.username}`, user.email);
    await handleRedisOperation(
      "set",
      `email:${user.email}`,
      JSON.stringify(user)
    );

    return user;
  } catch (error) {
    handleCaughtActionError(
      "Error in fetching user",
      error.message,
      throwable,
      null
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function createUser(data, throwable = false) {
  const prisma = connectDB();

  try {
    const cacheEmail = await handleRedisOperation(
      "get",
      `username:${data.username}`
    );

    const userExists = cacheEmail
      ? true
      : await prisma.user.findUnique({
          where: {
            username: data.username,
          },
        });

    if (userExists)
      return handleActionError(
        "Username already exists. Please choose a different username.",
        throwable,
        null
      );

    data.firstname = data.firstname || "";
    data.lastname = data.lastname || "";
    const newUser = await prisma.user.create({
      data,
    });

    if (!newUser)
      return handleActionError(
        "Failed to create user. Please try again later.",
        throwable,
        null
      );

    await handleRedisOperation(
      "set",
      `username:${newUser.username}`,
      newUser.email
    );
    await handleRedisOperation(
      "set",
      `email:${newUser.email}`,
      JSON.stringify(newUser)
    );

    return newUser;
  } catch (error) {
    handleCaughtActionError(
      "Error in creating user",
      error.message,
      throwable,
      null
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function updateUser(data, throwable = false) {
  const prisma = connectDB();

  try {
    const cacheUser = await handleRedisOperation("get", `email:${data.email}`);

    const user = cacheUser
      ? JSON.parse(cacheUser)
      : await prisma.user.findUnique({
          where: {
            email: data.email,
          },
          include: {
            experience: true,
            projects: true,
            education: true,
          },
        });

    if (!user) return handleActionError("User not found.", throwable, null);

    if (user.username !== data.username) {
      const cacheOtherEmail = await handleRedisOperation(
        "get",
        `username:${data.username}`
      );
      const cacheOtherUser = cacheOtherEmail
        ? await handleRedisOperation("get", `email:${cacheOtherEmail}`)
        : null;

      const sameUsernameExists =
        cacheOtherUser ||
        (await prisma.user.findUnique({
          where: {
            username: data.username,
          },
        }));

      if (sameUsernameExists)
        return handleActionError("Username already exists.", throwable, null);
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
      return handleActionError("Failed to update user.", throwable, null);

    await handleRedisOperation("del", `username:${user.username}`);
    await handleRedisOperation(
      "set",
      `username:${updatedUser.username}`,
      updatedUser.email
    );
    await handleRedisOperation(
      "set",
      `email:${updatedUser.email}`,
      JSON.stringify(updatedUser)
    );

    return updatedUser;
  } catch (error) {
    handleCaughtActionError(
      "Error in updating user",
      error.message,
      throwable,
      null
    );
  } finally {
    await prisma.$disconnect();
  }
}
