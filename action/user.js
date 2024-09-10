import { connectDB } from "@/lib/db";

export async function getUserByEmail(email) {
  const prisma = connectDB();
  let user;
  try {
    user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        projects: true,
        education: true,
        experience: true,
      },
    });
  } catch (error) {
    console.log(error);
  } finally {
    return user;
  }
}

export async function getAllUsers() {
  const prisma = connectDB();
  let users = [];
  try {
    users = await prisma.user.findMany();
  } catch (error) {
    console.log(error);
  } finally {
    return users;
  }
}

export async function getUserByUsername(username) {
  const prisma = connectDB();
  let user;
  try {
    user = await prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        projects: true,
        education: true,
        experience: true,
      },
    });
  } catch (error) {
    console.log(error);
  } finally {
    return user;
  }
}
