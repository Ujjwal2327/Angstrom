import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { handleRedisOperation, updateUserCache } from "@/lib/redis";
import { handleActionError, handleCaughtActionError } from "@/utils";

// return is used with handleActionError to ensure that the function immediately exits after the error handling logic has been applied.

export async function getUserByEmail(email, throwable = false) {
  if (!email || !email.trim()) return null;

  try {
    const cacheUser = await handleRedisOperation("get", `email:${email}`);
    if (cacheUser) return JSON.parse(cacheUser);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        projects: { orderBy: { order: "asc" } },
        education: { orderBy: { order: "asc" } },
        experience: { orderBy: { order: "asc" } },
      },
    });

    if (!user) return null;

    await updateUserCache(user);

    return user;
  } catch (error) {
    return handleCaughtActionError(
      "Error in fetching user",
      error.message,
      throwable,
      null,
    );
  }
}

export async function getUserByUsername(username, throwable = false) {
  if (!username || !username?.trim()) return null;

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
      where: {
        username,
      },
      include: {
        projects: { orderBy: { order: "asc" } },
        education: { orderBy: { order: "asc" } },
        experience: { orderBy: { order: "asc" } },
      },
    });

    if (!user) return null;

    await updateUserCache(user);

    return user;
  } catch (error) {
    return handleCaughtActionError(
      "Error in fetching user",
      error.message,
      throwable,
      null,
    );
  }
}

export async function createUser(data, throwable = false) {
  try {
    const cacheEmail = await handleRedisOperation(
      "get",
      `username:${data.username}`,
    );

    // BUGFIX: this used to `findUnique` without `include`, so if this lookup
    // hit (username taken) and got cached via `updateUserCache(userExists)`
    // below, the cached object would be missing `projects`/`education`/
    // `experience` entirely (not even empty arrays — the keys wouldn't
    // exist). Every reader downstream already defends against this with
    // `?.` and `|| []`, so it never crashed, but it's an inconsistent cache
    // shape for no reason. Including relations here keeps every cached user
    // object shaped the same way, regardless of which code path populated it.
    const userExists = cacheEmail
      ? true
      : await prisma.user.findUnique({
          where: {
            username: data.username,
          },
          include: {
            projects: { orderBy: { order: "asc" } },
            education: { orderBy: { order: "asc" } },
            experience: { orderBy: { order: "asc" } },
          },
        });

    if (userExists) {
      if (!cacheEmail) await updateUserCache(userExists);
      return handleActionError(
        "Username already exists. Please choose a different username.",
        throwable,
        null,
      );
    }

    const newUserRaw = await prisma.user.create({
      data,
    });

    // Same consistency fix as above: `prisma.user.create` never returns
    // relations (there's nothing to include yet), so explicitly shape this
    // as an empty-relations user rather than leaving those keys undefined.
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
      "Error in creating user",
      error.message,
      throwable,
      null,
    );
  }
}

export async function updateUser(data, throwable = false) {
  try {
    // BUGFIX: this used to read the "before" state (most importantly
    // `user.id`, used as the foreign key for every experience/project/
    // education upsert below) from the Redis cache first. Cache is fine for
    // display reads, but a mutation needs ground truth: if the cached value
    // is stale — e.g. because REDIS_URL is shared between your local and
    // production environments while DATABASE_URL points at two different
    // Postgres databases — `user.id` can be a row id from a *different*
    // database than the one you're actually connected to right now. Handing
    // that id to `experience.upsert`/`project.upsert`/`education.upsert` as
    // a foreign key then fails with exactly "Foreign key constraint
    // violated", because no User with that id exists in this database.
    // Always reading fresh from Postgres here guarantees the id (and the
    // existing relations we diff against) are real for the database we're
    // actually writing to. This also self-heals the stale cache entry,
    // since `updateUserCache` re-caches the correct, fresh data at the end.
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
      include: {
        projects: true,
        education: true,
        experience: true,
      },
    });

    if (!user) return handleActionError("User not found.", throwable, null);

    if (user.username !== data.username) {
      // Same reasoning as above: this gate decides whether the update is
      // allowed to proceed at all, so it needs to check the real database,
      // not a cache entry that might be stale or from a different
      // environment. Previously, a truthy `cacheOtherEmail` short-circuited
      // straight past the Postgres check, so a stale cache entry could
      // falsely block a perfectly valid username change.
      const sameUsernameExists = await prisma.user.findUnique({
        where: {
          username: data.username,
        },
      });

      if (sameUsernameExists) {
        await updateUserCache(sameUsernameExists);
        return handleActionError("Username already exists.", throwable, null);
      }
    }

    // Perform the update within a single transaction
    // NOTE: this is the only interactive transaction (`$transaction(async tx
    // => {...})`) in the codebase. If updates still fail after applying the
    // DATABASE_URL/DIRECT_URL + schema.prisma fix, the error logged here
    // (server console, not the toast) will tell us whether it's still a
    // connection-pooling issue (e.g. "prepared statement ... already
    // exists") or something else entirely.
    const updatedUser = await prisma.$transaction(
      async (tx) => {
        // Prepare sets and operations
        const newExperienceSet = new Set(
          (data.experience || []).map(
            (exp) => `${exp.company}-${exp.position}`,
          ),
        );
        const newProjectsSet = new Set(
          (data.projects || []).map((proj) => proj.name),
        );
        const newEducationSet = new Set(
          (data.education || []).map((edu) => edu.degree),
        );

        // Handle experience updates or creates
        const experienceToDelete = (user.experience || []).filter(
          (exp) => !newExperienceSet.has(`${exp.company}-${exp.position}`),
        );
        const deleteExperiencePromises = experienceToDelete.map((exp) =>
          tx.experience.delete({ where: { id: exp.id } }),
        );
        const upsertExperiencePromises = (data.experience || []).map((exp) =>
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
        );

        // Handle project updates or creates
        const projectsToDelete = (user.projects || []).filter(
          (project) => !newProjectsSet.has(project.name),
        );
        const deleteProjectPromises = projectsToDelete.map((project) =>
          tx.project.delete({ where: { id: project.id } }),
        );
        const upsertProjectPromises = (data.projects || []).map((project) =>
          tx.project.upsert({
            where: { userId_name: { userId: user.id, name: project.name } },
            update: project,
            create: { ...project, userId: user.id },
          }),
        );

        // Handle education updates or creates
        const educationToDelete = (user.education || []).filter(
          (edu) => !newEducationSet.has(edu.degree),
        );
        const deleteEducationPromises = educationToDelete.map((edu) =>
          tx.education.delete({ where: { id: edu.id } }),
        );
        const upsertEducationPromises = (data.education || []).map((edu) =>
          tx.education.upsert({
            where: { userId_degree: { userId: user.id, degree: edu.degree } },
            update: edu,
            create: { ...edu, userId: user.id },
          }),
        );

        // Perform all deletions and upserts in parallel
        await Promise.all([
          ...deleteExperiencePromises,
          ...upsertExperiencePromises,
          ...deleteProjectPromises,
          ...upsertProjectPromises,
          ...deleteEducationPromises,
          ...upsertEducationPromises,
        ]);

        // Update the user record
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
          include: {
            projects: { orderBy: { order: "asc" } },
            education: { orderBy: { order: "asc" } },
            experience: { orderBy: { order: "asc" } },
          },
        });
      },
      {
        maxWait: 5000, // Wait up to 5 seconds for a connection
        timeout: 20000, // Abort the transaction if it takes more than 20 seconds
      },
    );

    await updateUserCache(updatedUser, user.username);

    revalidatePath(`/users/${updatedUser.username}`);
    revalidatePath("/users");
    if (user.username !== updatedUser.username) {
      revalidatePath(`/users/${user.username}`);
    }

    return updatedUser;
  } catch (error) {
    return handleCaughtActionError(
      "Error in updating user",
      error.message,
      throwable,
      null,
    );
  }
}

export async function getAllUsers(throwable = false) {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    return handleCaughtActionError(
      "Error in fetching users",
      error.message,
      throwable,
      [],
    );
  }
}
