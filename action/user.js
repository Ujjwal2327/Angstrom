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
  try {
    // Only need id + username here — the diff-by-row logic below is gone,
    // so we no longer need the full projects/education/experience arrays.
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true, username: true },
    });
    if (!user) return handleActionError("User not found.", throwable, null);

    // Username collision check — against Postgres, not cache.
    if (user.username !== data.username) {
      const collision = await prisma.user.findUnique({
        where: { username: data.username },
      });
      if (collision) {
        await updateUserCache(collision);
        return handleActionError("Username already taken.", throwable, null);
      }
    }

    const updatedUser = await prisma.$transaction(
      async (tx) => {
        // Wipe + bulk-recreate instead of diffing row-by-row.
        //
        // BUGFIX (Vercel 504 / FUNCTION_INVOCATION_TIMEOUT): the previous
        // version deleted/upserted experience, projects, and education one
        // row at a time inside Promise.all(). That looks parallel but isn't —
        // an interactive transaction is bound to a single DB connection, so
        // every one of those queries actually gets sent to Postgres one
        // after another. With N rows across the three tables that's up to
        // 2N sequential round trips, on top of the initial lookup and the
        // closing update. On localhost the latency per round trip is small
        // enough to hide this; against a remote/serverless Postgres from a
        // Vercel function it adds up fast enough to blow past the function's
        // time limit.
        //
        // Safe to replace with delete-all + recreate-all because nothing
        // outside this table references these rows by their DB `id` —
        // uniqueness is on [userId, name] / [userId, degree] /
        // [userId, company, position], not `id`, and
        // shared/getFormDefaultValues.js never even sends `id` back to the
        // server. This turns an unbounded number of round trips into a
        // fixed ~6, regardless of profile size.
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

    // Update cache and revalidate affected routes
    await updateUserCache(updatedUser, user.username);
    revalidatePath(`/users/${updatedUser.username}`);
    revalidatePath("/users");
    if (user.username !== updatedUser.username) {
      revalidatePath(`/users/${user.username}`);
    }

    return updatedUser;
  } catch (error) {
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
