import { connectDB } from "@/lib/db";

export async function getUserByEmail(email) {
  const prisma = connectDB();
  let user;
  try {
    user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
  } catch (error) {
    console.log(error);
  } finally {
    return user;
  }
}
