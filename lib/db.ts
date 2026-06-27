import { PrismaClient } from "@prisma/client";

// Prisma 6 singleton — same pattern as before.
// The instance is reused across hot-reloads in development via the global,
// and created fresh each cold-start in production (one per serverless invocation).
const prismaClientSingleton = () =>
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["error"],
  });

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;