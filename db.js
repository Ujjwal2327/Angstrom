import { PrismaClient } from "@prisma/client";

let prisma;

export const connectDB = () => {
  if (!prisma) prisma = new PrismaClient();
  return prisma;
};
