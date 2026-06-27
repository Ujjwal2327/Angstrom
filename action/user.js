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
    // Always read from Postgres — never rely on the cache for the "before" state.
    // Stale cache entries (especially across environments sharing a Redis instance)
    // can carry the wrong user.id which causes FK violations in the transaction.
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { projects: true, education: true, experience: true },
    });
    if (!user) return handleActionError("User not found.", throwable, null);

    // Username collision check — also against Postgres, not cache.
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
        // Build sets for diffing
        const newExpSet = new Set(
          (data.experience || []).map((e) => `${e.company}|${e.position}`),
        );
        const newProjSet = new Set((data.projects || []).map((p) => p.name));
        const newEduSet = new Set((data.education || []).map((e) => e.degree));

        await Promise.all([
          // Deletions
          ...(user.experience || [])
            .filter((e) => !newExpSet.has(`${e.company}|${e.position}`))
            .map((e) => tx.experience.delete({ where: { id: e.id } })),
          ...(user.projects || [])
            .filter((p) => !newProjSet.has(p.name))
            .map((p) => tx.project.delete({ where: { id: p.id } })),
          ...(user.education || [])
            .filter((e) => !newEduSet.has(e.degree))
            .map((e) => tx.education.delete({ where: { id: e.id } })),

          // Upserts
          ...(data.experience || []).map((exp) =>
            tx.experience.upsert({
              where: {
                userId_company_position: {
                  userId: user.id,
                  company: exp.company,
                  position: exp.position,
                },
              },
              update: exp,
              create: { ...exp, userId: user.id },
            }),
          ),
          ...(data.projects || []).map((proj) =>
            tx.project.upsert({
              where: { userId_name: { userId: user.id, name: proj.name } },
              update: proj,
              create: { ...proj, userId: user.id },
            }),
          ),
          ...(data.education || []).map((edu) =>
            tx.education.upsert({
              where: { userId_degree: { userId: user.id, degree: edu.degree } },
              update: edu,
              create: { ...edu, userId: user.id },
            }),
          ),
        ]);

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
