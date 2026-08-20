// action/user.js
import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { handleRedisOperation, updateUserCache } from "@/lib/redis";
import {
  handleActionError,
  handleCaughtActionError,
  uniqueValidator,
} from "@/utils";
import { sanitizeAchievementsHtml } from "@/lib/sanitizeHtml";
import { defaultSectionOrder } from "@/constants";

// ── Shared Prisma include shape ───────────────────────────────────────────────
// Keeping one definition avoids drift between read paths.
const USER_INCLUDE = {
  projects: { orderBy: { order: "asc" } },
  education: { orderBy: { order: "asc" } },
  experience: { orderBy: { order: "asc" } },
};

// Guards against anything but a clean permutation of the 5 known section ids
// reaching the DB. formSchema.js already validates this client-side, but
// this action is the one place every save funnels through — including a
// direct /api/user PUT that skips the form entirely — so it's the right
// place for the real, load-bearing check.
function normalizeSectionOrder(order) {
  if (!Array.isArray(order)) return defaultSectionOrder;
  const kept = order.filter((id) => defaultSectionOrder.includes(id));
  const unique = [...new Set(kept)];
  const missing = defaultSectionOrder.filter((id) => !unique.includes(id));
  return [...unique, ...missing];
}

// ── updateUser's diffing helpers ────────────────────────────────────────────
// Everything below exists so updateUser() can touch only the rows that
// actually changed, instead of wiping and bulk-recreating all of
// experience/projects/education on every save (see updateUser for how
// these get used).

// Order-independent array equality — used for Project.skills, where what
// matters is which skills are selected, not the order they happened to be
// toggled on in.
function sameStringSet(a = [], b = []) {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((v, i) => v === sortedB[i]);
}

// Field-level equality per relation, used once two rows are already known
// to be "the same row" (matched by natural key in diffRelation) to decide
// whether it actually needs an UPDATE or can be left alone. Optional
// fields are normalized the same way their schema's .transform() already
// does, so a value coming back from Postgres (possibly `null`) compares
// equal to the equivalent freshly-submitted form value (possibly `""` or
// `undefined`) instead of registering as "changed" for no real reason.
function isSameExperience(existing, incoming) {
  return (
    existing.start === incoming.start &&
    (existing.end || "Present") === (incoming.end || "Present") &&
    (existing.about || "") === (incoming.about || "") &&
    existing.order === incoming.order
  );
}

function isSameProject(existing, incoming) {
  return (
    (existing.live_url || "") === (incoming.live_url || "") &&
    existing.code_url === incoming.code_url &&
    (existing.category || "") === (incoming.category || "") &&
    existing.about === incoming.about &&
    existing.order === incoming.order &&
    sameStringSet(existing.skills, incoming.skills)
  );
}

function isSameEducation(existing, incoming) {
  return (
    existing.institution === incoming.institution &&
    (existing.specialization || "") === (incoming.specialization || "") &&
    (existing.score || "") === (incoming.score || "") &&
    existing.start === incoming.start &&
    (existing.end || "Present") === (incoming.end || "Present") &&
    existing.order === incoming.order
  );
}

// Diffs a relation's current DB rows against the incoming form data by
// natural key — never by DB `id`, since the form never sends one back (see
// getFormDefaultValues.js, which doesn't include `id` in any of the three
// arrays). Returns exactly the operations needed to bring the DB in line:
// rows to insert, existing rows whose content actually changed to update
// in place (keeping their `id`), and rows no longer present to remove.
// Anything identical to what's already stored ends up in none of the three
// lists — no DELETE, no UPDATE, no wasted write.
//
// Caveat: because identity is the natural key, renaming the field that
// makes up that key (a project's name, an education's degree, an
// experience's company+position) looks like "one row removed, a different
// one added" rather than "this row was renamed" — the renamed item gets a
// new `id`. Nothing in this app currently reads these ids as stable across
// a save (see applyRelationDiff below), so that's a cosmetic trade-off, not
// a regression — it's exactly what happened to *every* row on *every* save
// before this change.
function diffRelation(existingRows, incomingRows, keyOf, isSame) {
  const existingByKey = new Map(existingRows.map((row) => [keyOf(row), row]));
  const incomingByKey = new Map(incomingRows.map((row) => [keyOf(row), row]));

  const toCreate = [];
  const toUpdate = [];
  for (const [key, incoming] of incomingByKey) {
    const existing = existingByKey.get(key);
    if (!existing) toCreate.push(incoming);
    else if (!isSame(existing, incoming)) {
      toUpdate.push({ id: existing.id, data: incoming });
    }
  }

  const toDeleteIds = existingRows
    .filter((row) => !incomingByKey.has(keyOf(row)))
    .map((row) => row.id);

  return { toCreate, toUpdate, toDeleteIds };
}

// Applies one relation's diff through its Prisma model delegate (pass
// tx.experience / tx.project / tx.education). Delete-then-create-then-update
// so a rename that happens to reuse a name freed up elsewhere in the same
// save (delete "Foo", separately create a new project also named "Foo")
// never trips the table's unique constraint. Sequential on purpose, not
// Promise.all — an interactive transaction holds a single DB connection for
// its whole duration, so wrapping these wouldn't make Postgres run them
// concurrently, just add false confidence that it does.
async function applyRelationDiff(model, diff, userId) {
  if (diff.toDeleteIds.length) {
    await model.deleteMany({ where: { id: { in: diff.toDeleteIds } } });
  }
  if (diff.toCreate.length) {
    await model.createMany({
      data: diff.toCreate.map((item) => ({ ...item, userId })),
    });
  }
  for (const { id, data: item } of diff.toUpdate) {
    await model.update({ where: { id }, data: item });
  }
}

// Defense-in-depth mirror of formSchema.js's uniqueness .refine()s — this
// function is the one place every save funnels through, including a direct
// /api/user PUT that skips client-side Zod validation entirely (same
// reasoning as normalizeSectionOrder above). diffRelation keys off these
// exact combinations, so duplicates need to be caught *before* the diff
// runs — otherwise two incoming rows sharing a key would silently collapse
// into "last one wins" instead of surfacing the same clear error the form
// already gives.
function getDuplicateKeyError(data) {
  const experienceKeys = (data.experience || []).map(
    (e) => `${e.company}|${e.position}`,
  );
  if (!uniqueValidator(experienceKeys)) {
    return "Company and Position combinations must be unique.";
  }

  const projectNames = (data.projects || []).map((p) => p.name);
  if (!uniqueValidator(projectNames)) return "Project names must be unique.";

  const degrees = (data.education || []).map((e) => e.degree);
  if (!uniqueValidator(degrees)) return "Degrees must be unique.";

  return null;
}

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
  // Checked before anything else — pure JS, no DB round trip needed to
  // catch this class of bad input.
  const duplicateError = getDuplicateKeyError(data);
  if (duplicateError) {
    return handleActionError(duplicateError, throwable, null);
  }

  try {
    // Need the existing experience/projects/education rows this time (not
    // just id + username) so they can be diffed below instead of being
    // blindly wiped and rebuilt regardless of what actually changed.
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: USER_INCLUDE,
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

    // Diffed outside the transaction — plain JS comparison, no reason to
    // hold the transaction's one DB connection open while doing it.
    const experienceDiff = diffRelation(
      user.experience,
      data.experience || [],
      (e) => `${e.company}|${e.position}`,
      isSameExperience,
    );
    const projectDiff = diffRelation(
      user.projects,
      data.projects || [],
      (p) => p.name,
      isSameProject,
    );
    const educationDiff = diffRelation(
      user.education,
      data.education || [],
      (e) => e.degree,
      isSameEducation,
    );

    const updatedUser = await prisma.$transaction(
      async (tx) => {
        // BUGFIX (unnecessary writes): this used to unconditionally wipe
        // and bulk-recreate all three tables on every save, regardless of
        // whether anything in them had changed — which meant every row got
        // a brand-new `id` on every single save, even rows nobody touched.
        // Now each table only sees the DELETE/CREATE/UPDATE its own diff
        // actually calls for — editing one experience entry issues exactly
        // one UPDATE for that row; if projects/education weren't touched
        // at all, those two tables see zero statements this save.
        await applyRelationDiff(tx.experience, experienceDiff, user.id);
        await applyRelationDiff(tx.project, projectDiff, user.id);
        await applyRelationDiff(tx.education, educationDiff, user.id);

        return tx.user.update({
          where: { email: data.email },
          data: {
            username: data.username,
            firstname: data.firstname,
            lastname: data.lastname,
            pic: data.pic,
            about: data.about,
            // Sanitized here — not just in the client's zod schema — because
            // this is the one place every save funnels through, and the
            // public profile now renders this HTML directly server-side (see
            // components/profile/sections/AchievementsSection.js), so this
            // is now a real security boundary, not just a UX nicety.
            achievements: sanitizeAchievementsHtml(data.achievements),
            profiles: data.profiles,
            skills: { set: data.skills },
            sectionOrder: normalizeSectionOrder(data.sectionOrder),
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
