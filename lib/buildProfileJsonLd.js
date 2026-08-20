// lib/buildProfileJsonLd.js
//
// Emits the object that gets embedded directly in the profile page's HTML
// (see app/users/[username]/page.js) as a <script type="application/ld+json">
// block, so the *entire* profile is available as one parseable object to
// anything that fetches the URL — an AI chat tool, a scraper, whatever —
// without needing to run this page's JS or infer content from layout/CSS.
//
// Deliberately NOT strict schema.org-valid in a few places ("projects" and
// "category" aren't real schema.org Person properties) — the goal is a
// complete, unambiguous read for an AI/LLM, not Google rich-results
// eligibility. Field *names* are intentionally the plain versions
// (education/experience/projects), not the stylized ones shown on the page
// (degree/changelog/proof of work) — the cute wording is for humans
// browsing the page, not for whatever's parsing this block.
import { profiles as profileMeta } from "@/constants";

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildProfileJsonLd(user) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://angstrom.vercel.app";
  const profileUrl = `${baseUrl}/users/${user.username}`;
  const fullName =
    [user.firstname, user.lastname].filter(Boolean).join(" ").trim() ||
    user.username;

  const sameAs = Object.entries(user.profiles || {})
    .map(([key, handle]) => {
      const base = profileMeta[key]?.base_url;
      return base && handle ? `${base}${handle}` : null;
    })
    .filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: profileUrl,
    mainEntity: {
      "@type": "Person",
      name: fullName,
      alternateName: user.username,
      description: user.about?.trim() || undefined,
      email: user.email,
      image: user.pic || undefined,
      url: profileUrl,
      sameAs: sameAs.length ? sameAs : undefined,
      knowsAbout: user.skills?.length ? user.skills : undefined,
    },
    achievements: user.achievements ? stripHtml(user.achievements) : undefined,
    experience: user.experience?.length
      ? user.experience.map((e) => ({
          company: e.company,
          position: e.position,
          start: e.start,
          end: e.end || "Present",
          description: e.about || undefined,
        }))
      : undefined,
    education: user.education?.length
      ? user.education.map((ed) => ({
          institution: ed.institution,
          degree: ed.degree,
          specialization: ed.specialization || undefined,
          score: ed.score || undefined,
          start: ed.start,
          end: ed.end || "Present",
        }))
      : undefined,
    projects: user.projects?.length
      ? user.projects.map((p) => ({
          name: p.name,
          description: p.about,
          codeRepository: p.code_url,
          url: p.live_url !== p.code_url ? p.live_url : undefined,
          category: p.category || undefined,
          skills: p.skills?.length ? p.skills : undefined,
        }))
      : undefined,
  };
}
