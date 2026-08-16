// action/user.js
import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { handleRedisOperation, updateUserCache } from "@/lib/redis";
import { handleActionError, handleCaughtActionError } from "@/utils";

// ── Shared Prisma include shape ───────────────────────────────────────────────
// Keeping one definition avoids drift between read paths.
const USER_INCLUDE = {
  projects: { orderBy: { order: "asc" } },
  education: { orderBy: { order: "asc" } },
  experience: { orderBy: { order: "asc" } },
};

// ── Read helpers ──────────────────────────────────────────────────────────────

export async function getUserByEmail(email, throwable = false) {
  if (!email?.trim()) return null;
  try {
    const cached = await handleRedisOperation("get", `email:${email}`);
    if (cached) return JSON.parse(cached);

    const user = await prisma.user.findUnique({
      where: { email },
      include: USER_INCLUDE,
    });
    if (!user) return null;

    await updateUserCache(user);
    return user;
  } catch (error) {
    return handleCaughtActionError(
      "Error fetching user",
      error.message,
      throwable,
      null,
    );
  }
}

export async function getUserByUsername(username, throwable = false) {
  if (!username?.trim()) return null;
  try {
    const cacheEmail = await handleRedisOperation(
      "get",
      `username:${username}`,
    );
    const cacheUser = cacheEmail
      ? await handleRedisOperation("get", `email:${cacheEmail}`)
      : null;
    if (cacheUser) return JSON.parse(cacheUser);

    const user = await prisma.user.findUnique({
      where: { username },
      include: USER_INCLUDE,
    });
    if (!user) return null;

    await updateUserCache(user);
    return user;
  } catch (error) {
    return handleCaughtActionError(
      "Error fetching user",
      error.message,
      throwable,
      null,
    );
  }
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export async function createUser(data, throwable = false) {
  try {
    const cacheEmail = await handleRedisOperation(
      "get",
      `username:${data.username}`,
    );
    const userExists = cacheEmail
      ? true
      : await prisma.user.findUnique({
          where: { username: data.username },
          include: USER_INCLUDE,
        });

    if (userExists) {
      if (!cacheEmail) await updateUserCache(userExists);
      return handleActionError(
        "Username already taken. Please choose a different one.",
        throwable,
        null,
      );
    }

    const newUserRaw = await prisma.user.create({ data });
    const newUser = {
      ...newUserRaw,
      projects: [],
      education: [],
      experience: [],
    };
    await updateUserCache(newUser);
    return newUser;
  } catch (error) {
    return handleCaughtActionError(
      "Error creating user",
      error.message,
      throwable,
      null,
    );
  }
}

export async function updateUser(data, throwable = false) {
  // TEMP INSTRUMENTATION: this whole function was timing out on Vercel
  // (FUNCTION_INVOCATION_TIMEOUT) even after fixing the N+1 transaction
  // round trips, with total duration barely changing. These logs show up
  // in Vercel's function logs and will pinpoint exactly which phase below
  // is actually slow (initial lookup / transaction / cache update /
  // revalidate) — safe to delete once the real bottleneck is confirmed.
  const t0 = Date.now();
  try {
    // Only need id + username here — the diff-by-row logic below is gone,
    // so we no longer need the full projects/education/experience arrays.
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true, username: true },
    });
    console.log(`[updateUser] initial lookup: ${Date.now() - t0}ms`);
    if (!user) return handleActionError("User not found.", throwable, null);

    // Username collision check — against Postgres, not cache.
    if (user.username !== data.username) {
      const tCollision = Date.now();
      const collision = await prisma.user.findUnique({
        where: { username: data.username },
      });
      console.log(`[updateUser] collision check: ${Date.now() - tCollision}ms`);
      if (collision) {
        await updateUserCache(collision);
        return handleActionError("Username already taken.", throwable, null);
      }
    }

    const tTx = Date.now();
    const updatedUser = await prisma.$transaction(
      async (tx) => {
        // Wipe + bulk-recreate instead of diffing row-by-row — fixed ~6
        // round trips regardless of profile size. Safe because nothing
        // outside this table references these rows by their DB `id`
        // (uniqueness is on [userId, name] / [userId, degree] /
        // [userId, company, position], not `id`).
        await Promise.all([
          tx.experience.deleteMany({ where: { userId: user.id } }),
          tx.project.deleteMany({ where: { userId: user.id } }),
          tx.education.deleteMany({ where: { userId: user.id } }),
        ]);

        await Promise.all(
          [
            data.experience?.length &&
              tx.experience.createMany({
                data: data.experience.map((exp) => ({
                  ...exp,
                  userId: user.id,
                })),
              }),
            data.projects?.length &&
              tx.project.createMany({
                data: data.projects.map((proj) => ({
                  ...proj,
                  userId: user.id,
                })),
              }),
            data.education?.length &&
              tx.education.createMany({
                data: data.education.map((edu) => ({
                  ...edu,
                  userId: user.id,
                })),
              }),
          ].filter(Boolean),
        );

        return tx.user.update({
          where: { email: data.email },
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
          include: USER_INCLUDE,
        });
      },
      { maxWait: 5000, timeout: 20000 },
    );
    console.log(`[updateUser] transaction: ${Date.now() - tTx}ms`);

    // Update cache and revalidate affected routes
    const tCache = Date.now();
    await updateUserCache(updatedUser, user.username);
    console.log(`[updateUser] cache update: ${Date.now() - tCache}ms`);

    const tRevalidate = Date.now();
    revalidatePath(`/users/${updatedUser.username}`);
    revalidatePath("/users");
    if (user.username !== updatedUser.username) {
      revalidatePath(`/users/${user.username}`);
    }
    console.log(`[updateUser] revalidate: ${Date.now() - tRevalidate}ms`);
    console.log(`[updateUser] total: ${Date.now() - t0}ms`);

    return updatedUser;
  } catch (error) {
    console.log(`[updateUser] failed after: ${Date.now() - t0}ms`);
    return handleCaughtActionError(
      "Error updating user",
      error.message,
      throwable,
      null,
    );
  }
}

export async function getAllUsers(throwable = false) {
  try {
    return await prisma.user.findMany({ orderBy: { id: "asc" } });
  } catch (error) {
    return handleCaughtActionError(
      "Error fetching users",
      error.message,
      throwable,
      [],
    );
  }
}
