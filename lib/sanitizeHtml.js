// lib/sanitizeHtml.js
//
// Server-only. Used before persisting `achievements` HTML so the profile
// page can render it directly via dangerouslySetInnerHTML (needed for SSR /
// AI-fetchability — see components/profile/sections/AchievementsSection.js)
// without risking stored XSS.
//
// Before that change, `achievements` only ever got displayed by being
// parsed through Tiptap's schema-restricted editor, which implicitly
// stripped anything outside the allowed tags/marks — so nothing enforced
// that server-side. Now that the display path renders the raw HTML string
// directly, this re-establishes that restriction at the one place every
// save actually funnels through (action/user.js's updateUser), regardless
// of whether the HTML came from the real editor or was POSTed straight to
// /api/user. Mirrors the tag set components/Tiptap/Tiptap.js's editor
// schema already limits users to, so legitimate content is unaffected.
import sanitizeHtml from "sanitize-html";

const OPTIONS = {
  allowedTags: [
    "h2",
    "p",
    "strong",
    "em",
    "a",
    "ul",
    "li",
    "blockquote",
    "pre",
    "code",
  ],
  allowedAttributes: { a: ["href"] },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    // Every link in someone's saved HTML should behave like the "profiles"
    // links elsewhere on the profile — open in a new tab, without handing
    // the destination a `window.opener` reference back to this page.
    a: sanitizeHtml.simpleTransform("a", {
      target: "_blank",
      rel: "noopener noreferrer",
    }),
  },
};

export function sanitizeAchievementsHtml(html) {
  if (!html || typeof html !== "string") return "";
  const clean = sanitizeHtml(html, OPTIONS).trim();
  // Same "empty editor" cases formSchema's transform already treated as blank.
  return clean === "<p></p>" || clean === "<h2></h2>" ? "" : clean;
}
