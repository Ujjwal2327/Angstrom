import { connectDB } from "@/lib/db";

export async function getUserByEmail(email, throwable = false) {
  if (!email || !email.trim()) {
    const errorMessage = "Invalid email provided.";
    if (throwable) throw new Error(errorMessage);
    else {
      console.error(errorMessage);
      return null;
    }
  }

  const prisma = connectDB();
  try {
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

    if (!user) {
      const errorMessage = "User not found.";
      if (throwable) throw new Error(errorMessage);
      else {
        console.error(errorMessage);
        return null;
      }
    }

    return user;
  } catch (error) {
    const errorMessage = error.message
      ? `Error in fetching user: ${error.message}`
      : "Error in fetching user";
    console.error(errorMessage);
    if (throwable) throw new Error(errorMessage);
    else return null;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getAllUsers(throwable = false) {
  const prisma = connectDB();
  try {
    const users = await prisma.user.findMany();
    if (!users?.length) {
      const errorMessage = "No user found.";
      if (throwable) throw new Error(errorMessage);
      else {
        console.error(errorMessage);
        return [];
      }
    }
    return users;
  } catch (error) {
    const errorMessage = error.message
      ? `Error in fetching users: ${error.message}`
      : "Error in fetching users";
    console.error(errorMessage);
    if (throwable) throw new Error(errorMessage);
    else return [];
  } finally {
    await prisma.$disconnect();
  }
}

export async function getUserByUsername(username, throwable = false) {
  if (!username || !username?.trim()) {
    const errorMessage = "Invalid username provided.";
    if (throwable) throw new Error(errorMessage);
    else {
      console.error(errorMessage);
      return null;
    }
  }

  const prisma = connectDB();
  try {
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

    if (!user) {
      const errorMessage = "User not found.";
      if (throwable) throw new Error(errorMessage);
      else {
        console.error(errorMessage);
        return null;
      }
    }

    return user;
  } catch (error) {
    const errorMessage = error.message
      ? `Error in fetching user: ${error.message}`
      : "Error in fetching user";
    console.error(errorMessage);
    if (throwable) throw new Error(errorMessage);
    else return null;
  } finally {
    await prisma.$disconnect();
  }
}

export async function createUser(data, throwable = false) {
  const prisma = connectDB();

  try {
    const userExists = await prisma.user.findUnique({
      where: {
        username: data.username,
      },
    });
    if (userExists) {
      const errorMessage =
        "Username already exists. Please choose a different username.";
      if (throwable) throw new Error(errorMessage);
      else {
        console.error(errorMessage);
        return null;
      }
    }

    data.firstname = data.firstname || "";
    data.lastname = data.lastname || "";
    const newUser = await prisma.user.create({
      data,
    });

    if (!newUser) {
      const errorMessage = "Failed to create user. Please try again later.";
      if (throwable) throw new Error(errorMessage);
      else {
        console.error(errorMessage);
        return null;
      }
    }
    return newUser;
  } catch (error) {
    const errorMessage = error.message
      ? `Error in creating user: ${error.message}`
      : "Error in creating user";
    console.error(errorMessage);
    if (throwable) throw new Error(errorMessage);
    else return null;
  } finally {
    await prisma.$disconnect();
  }
}

export async function updateUser(data, throwable = false) {
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

    if (!user) {
      const errorMessage = "User not found.";
      if (throwable) throw new Error(errorMessage);
      else {
        console.error(errorMessage);
        return null;
      }
    }

    if (user.username !== data.username) {
      const sameUsernameUser = await prisma.user.findUnique({
        where: {
          username: data.username,
        },
      });
      if (sameUsernameUser) {
        const errorMessage = "Username already exists.";
        if (throwable) throw new Error(errorMessage);
        else {
          console.error(errorMessage);
          return null;
        }
      }
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

    if (!updatedUser) {
      const errorMessage = "Failed to update user.";
      if (throwable) throw new Error(errorMessage);
      else {
        console.error(errorMessage);
        return null;
      }
    }

    return updatedUser;
  } catch (error) {
    const errorMessage = error.message
      ? `Error in updating user: ${error.message}`
      : "Error in updating user";
    console.error(errorMessage);
    if (throwable) throw new Error(errorMessage);
    else return null;
  } finally {
    await prisma.$disconnect();
  }
}
