// components/forms/ProfileForm/shared/aiImport.js
//
// Everything the "Import with AI" feature needs that isn't UI:
//   - generateAiImportPrompt(user)              -> the text the user copies out
//   - extractJson(text)                         -> pulls JSON out of whatever came back
//   - normalizeAiResult(raw, currentValues, email) -> turns that into a safe, form-shaped object
//
// Kept in one file since all three only ever get used together, from AiImportDialog.js.

import { getFormDefaultValues } from "./getFormDefaultValues";
import { profiles as knownProfiles } from "@/constants";

// Using a constant instead of literal backticks lets the big template
// literal below stay a single ordinary string — no escaping to track.
const FENCE = "```";

// ── 1. Prompt generation ────────────────────────────────────────────────────

export function generateAiImportPrompt(user) {
  const current = getFormDefaultValues(user);
  const profileKeys = Object.keys(knownProfiles).join(", ");
  const currentJson = JSON.stringify(current, null, 2);

  return `You're helping optimize a developer's professional portfolio. Be thorough, be honest, and write like a sharp human — not like an AI.

## What to do

1. Read the CURRENT PROFILE below, then everything under MY LINKS & EXTRA INFO at the very end.
2. Actually open every link you're able to reach — GitHub repos, live project URLs, coding-profile pages, a resume, a personal site, anything. Read READMEs, check the real tech stack (package.json / requirements.txt / actual code, not a guess from the project's name), and understand what each project actually does and who it's for.
3. For every project, find the ONE thing about it that's genuinely interesting and lead with that. Then say what it does and how it's built. Two to four sentences — no more.
4. Build the skills list from everything you found: the current list, languages/frameworks you actually saw used in the repos, anything named in a resume or LinkedIn. Merge near-duplicates ("React" / "ReactJS" -> pick one), ordered strongest / most-used first.
5. If a link is broken, private, or you can't open it (LinkedIn almost always blocks this) — don't guess. Say so in one short line above the JSON, and leave that piece of the profile exactly as it currently is.
6. Order the "projects" array from strongest to weakest — not personal favorite, but "does this actually show real skill." The profile page renders them in a grid where project #1 and #4 in every group of four (then #5 and #8, #9 and #12, and so on) get a wide, prominent card, while #2 and #3 (then #6 and #7, ...) get a narrower one. Put the strongest project at #1, and try to land a strong second project on #4 rather than burying it at #2 or #3.

## How to write

Everything you write has to be true. Never invent a number, a company, a technology, or a result you can't back up from what you were actually given or actually found. If you're not sure, write less, not more.

At the same time, actually try to sell the work. Most people undersell their own projects because they wrote the description in five minutes right after finishing them — you have time to look closer than they did.

Avoid AI-sounding writing:
- No "passionate about leveraging", "results-driven", "proven track record", "spearheaded", "seamlessly integrated", "robust solution", "cutting-edge", "dynamic", "synergy".
- Don't start every project the same way ("This project is a...").
- No vague claims with nothing behind them ("significantly improved performance" — improved it how, from what, if you actually know).
- Sound like a good developer explaining their own work to another developer: some pride, no fluff, no press release.

Prefer one concrete detail over three adjectives. Both lines below are 100% true — only one is worth reading:
  Before: "A todo app made with React and Firebase."
  After:  "A todo app with real-time sync across devices via Firestore listeners — open it in two tabs and watch changes land instantly, no polling."

## Output format

Return ONE JSON object in the shape below, inside a ${FENCE}json code block so it's easy to copy. You can add a short note above the code block (e.g. links you couldn't reach) — keep it to a line or two, and keep it OUTSIDE the code block.

Do not change "email", "username", or "pic" — copy them through exactly as given below.

For array fields (experience, projects, education, skills): if you include the field at all, include every item, even ones you're leaving unchanged — just copy those through as-is, don't return a partial array. You can leave a whole field out entirely if you have nothing to change on it — I'll keep what's already there.

${FENCE}json
{
  "email": "unchanged — copy from CURRENT PROFILE",
  "username": "unchanged — copy from CURRENT PROFILE",
  "firstname": "string",
  "lastname": "string",
  "pic": "unchanged — copy from CURRENT PROFILE",
  "about": "One or two short sentences, first person, sharp and specific — no resume-speak. This sits right under their name as a tagline, not a full bio, so cut anything generic.",
  "achievements": "HTML string, only these tags allowed: h2, p, strong, em, a (with href), ul/li, blockquote, pre/code — or an empty string",
  "profiles": {
    "PLATFORM_KEY": "just the handle on that platform, never the full URL"
  },
  "skills": ["string, 1-30 chars each, strongest / most-used first"],
  "experience": [
    {
      "company": "string",
      "position": "string",
      "start": "e.g. Jan 2023",
      "end": "e.g. Jun 2024 — leave blank for Present",
      "about": "1-3 sentences, impact first"
    }
  ],
  "projects": [
    {
      "name": "string",
      "code_url": "required — a real, valid URL",
      "live_url": "optional — a real, valid URL",
      "skills": ["subset of the top-level skills array that this project actually uses"],
      "about": "required — 2-4 sentences, the hook first"
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "specialization": "string, optional",
      "score": "string, optional — e.g. 8.5 CGPA or 3.8 GPA",
      "start": "e.g. Aug 2020",
      "end": "e.g. Jun 2024 — leave blank for Present"
    }
  ]
}
${FENCE}

Valid keys for "profiles" — use only these, and only for platforms I actually gave you a link or handle for: ${profileKeys}.

## CURRENT PROFILE

${FENCE}json
${currentJson}
${FENCE}

## MY LINKS & EXTRA INFO

<Paste your LinkedIn, GitHub, coding-profile links (LeetCode, Codeforces, etc.), a resume, a personal site, or anything else you want considered below. The more you give me, the better this works. Skip anything you don't have.>
`;
}

// ── 2. Pulling JSON back out of whatever the AI replied with ───────────────

export function extractJson(text) {
  if (!text || !text.trim()) return null;

  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenceMatch ? fenceMatch[1] : text).trim();

  try {
    return JSON.parse(candidate);
  } catch {
    // Fall through to brace-scanning below — the AI likely added a note
    // around the JSON despite being asked to keep it outside the fence.
  }

  const start = candidate.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escapeNext = false;

  for (let i = start; i < candidate.length; i++) {
    const ch = candidate[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    if (ch === "\\") {
      escapeNext = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;

    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        try {
          return JSON.parse(candidate.slice(start, i + 1));
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

// ── 3. Normalizing into a safe, form-shaped object ──────────────────────────

const toStr = (v, fallback = "") => (typeof v === "string" ? v : fallback);
const toArr = (v, fallback = []) => (Array.isArray(v) ? v : fallback);

function normalizeSkills(arr) {
  return toArr(arr)
    .filter((s) => typeof s === "string" && s.trim())
    .map((s) => s.trim().slice(0, 30));
}

function normalizeProfiles(obj) {
  if (!obj || typeof obj !== "object") return {};
  return Object.keys(knownProfiles).reduce((acc, key) => {
    const val = obj[key];
    if (typeof val !== "string" || !val.trim()) return acc;
    const base = knownProfiles[key].base_url;
    const trimmed = val.trim();
    // Defensive: if the AI pasted the full URL instead of just the handle, strip it.
    acc[key] = trimmed.startsWith(base) ? trimmed.slice(base.length) : trimmed;
    return acc;
  }, {});
}

function normalizeExperience(arr) {
  return toArr(arr).map((e, i) => ({
    order: i,
    company: toStr(e?.company),
    position: toStr(e?.position),
    start: toStr(e?.start),
    end: toStr(e?.end),
    about: toStr(e?.about),
  }));
}

function normalizeProjects(arr) {
  return toArr(arr).map((p, i) => ({
    order: i,
    name: toStr(p?.name),
    code_url: toStr(p?.code_url),
    live_url: toStr(p?.live_url) || toStr(p?.code_url),
    skills: normalizeSkills(p?.skills),
    about: toStr(p?.about),
  }));
}

function normalizeEducation(arr) {
  return toArr(arr).map((e, i) => ({
    order: i,
    institution: toStr(e?.institution),
    degree: toStr(e?.degree),
    specialization: toStr(e?.specialization),
    score: toStr(e?.score),
    start: toStr(e?.start),
    end: toStr(e?.end),
  }));
}

// currentValues = getFormDefaultValues(user), captured when the dialog opened.
// Used as the fallback for anything the AI's JSON left out, and as the
// source of truth for the handful of fields we never trust an AI reply for.
export function normalizeAiResult(raw, currentValues, realEmail) {
  const r = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};

  return {
    ...currentValues,
    email: realEmail,
    username: currentValues.username,
    pic: currentValues.pic,
    firstname: toStr(r.firstname, currentValues.firstname),
    lastname: toStr(r.lastname, currentValues.lastname),
    about: toStr(r.about, currentValues.about),
    achievements: toStr(r.achievements, currentValues.achievements),
    profiles: r.profiles
      ? normalizeProfiles(r.profiles)
      : currentValues.profiles,
    skills: r.skills ? normalizeSkills(r.skills) : currentValues.skills,
    experience: r.experience
      ? normalizeExperience(r.experience)
      : currentValues.experience,
    projects: r.projects
      ? normalizeProjects(r.projects)
      : currentValues.projects,
    education: r.education
      ? normalizeEducation(r.education)
      : currentValues.education,
  };
}
