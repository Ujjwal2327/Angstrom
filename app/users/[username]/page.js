// app/users/[username]/page.js
import { getUserByEmail, getUserByUsername } from "@/action/user";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { capitalizeString } from "@/utils";
import { sectionMeta, defaultSectionOrder } from "@/constants";
import ProfileHero from "@/components/profile/ProfileHero";
import DotNav from "@/components/profile/DotNav";
import AchievementsSection from "@/components/profile/sections/AchievementsSection";
import ExperienceSection from "@/components/profile/sections/ExperienceSection";
import ProjectsSection from "@/components/profile/sections/ProjectsSection";
import EducationSection from "@/components/profile/sections/EducationSection";
import SkillsSection from "@/components/profile/sections/SkillsSection";
import FooterCta from "@/components/profile/FooterCta";
import { buildProfileJsonLd } from "@/lib/buildProfileJsonLd";

export async function generateMetadata({ params }) {
  const { username: raw } = await params;
  const username = decodeURIComponent(raw);
  return {
    title: `${capitalizeString(username)}'s Portfolio | Angstrom`,
    description: `View ${capitalizeString(username)}'s developer portfolio on Angstrom.`,
    openGraph: {
      title: `${capitalizeString(username)}'s Portfolio`,
      description: `Developer portfolio built with Angstrom`,
    },
  };
}

// Maps each reorderable section id to a function that renders it with the
// right data plucked off `user`. The 5 components don't all take a prop
// shaped the same way (achievements is a single HTML string; the rest are
// arrays), so this is the one place that knows how to translate
// "section id" -> "rendered component". `key` is set explicitly here
// (rather than spread through a props object) so it's always attached the
// normal, unambiguous way.
const SECTION_RENDERERS = {
  achievements: (user, id, index, noBorder) => (
    <AchievementsSection
      key={id}
      id={id}
      index={index}
      noBorder={noBorder}
      achievements={user.achievements}
    />
  ),
  experience: (user, id, index, noBorder) => (
    <ExperienceSection
      key={id}
      id={id}
      index={index}
      noBorder={noBorder}
      experience={user.experience}
    />
  ),
  projects: (user, id, index, noBorder) => (
    <ProjectsSection
      key={id}
      id={id}
      index={index}
      noBorder={noBorder}
      projects={user.projects}
    />
  ),
  education: (user, id, index, noBorder) => (
    <EducationSection
      key={id}
      id={id}
      index={index}
      noBorder={noBorder}
      education={user.education}
    />
  ),
  skills: (user, id, index, noBorder) => (
    <SkillsSection
      key={id}
      id={id}
      index={index}
      noBorder={noBorder}
      skills={user.skills}
    />
  ),
};

export default async function UserPage({ params }) {
  const { username: raw } = await params;
  const username = decodeURIComponent(raw);

  // Parallel fetch: don't wait for auth before starting the profile lookup.
  const session = await auth();
  const [viewer, user] = await Promise.all([
    getUserByEmail(session?.user?.email),
    getUserByUsername(username),
  ]);

  if (!user) notFound();

  const isOwner = username === viewer?.username;

  // Whatever order the owner dragged these into on their edit page. Falls
  // back to the default (education last) for anyone who hasn't touched the
  // control yet, and self-heals if a saved order is ever missing an id —
  // see action/user.js's normalizeSectionOrder for the same guard server-side.
  const order =
    Array.isArray(user.sectionOrder) &&
    user.sectionOrder.length === defaultSectionOrder.length &&
    defaultSectionOrder.every((id) => user.sectionOrder.includes(id))
      ? user.sectionOrder
      : defaultSectionOrder;

  const hasContent = {
    achievements: Boolean(user.achievements?.trim()),
    experience: Boolean(user.experience?.length),
    projects: Boolean(user.projects?.length),
    education: Boolean(user.education?.length),
    skills: Boolean(user.skills?.length),
  };

  // A section with nothing in it (e.g. "changelog" for someone just
  // starting out) simply never renders — no empty section, no dot in the
  // nav, nothing that reads as "this person is missing something."
  const visibleSections = order.filter((id) => hasContent[id]);

  const dotNavSections = visibleSections.map((id) => ({
    id,
    label: sectionMeta[id].label,
  }));

  const jsonLd = buildProfileJsonLd(user);
  // `<` is escaped so a "</script>" inside any user-controlled field (about,
  // achievements, a project description, ...) can't prematurely close this
  // script tag — \u003c is a valid JSON escape, so the block still parses
  // identically once the browser reads it back out as JSON-LD.
  const jsonLdString = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return (
    <div className="-m-10 overflow-x-hidden">
      {/* Machine-readable summary of this whole page — see
          lib/buildProfileJsonLd.js. Lets anything that fetches this URL read
          the full profile from one parseable object instead of needing to
          run this page's JS or infer content from layout. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />

      <DotNav sections={dotNavSections} />

      <ProfileHero
        user={user}
        isOwner={isOwner}
        isCreator={user.username === process.env.MY_USERNAME}
      />

      {visibleSections.length === 0 ? (
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-32 text-center">
          <p className="font-mono text-xs text-muted-foreground/50 tracking-widest">
            {"// nothing here yet"}
          </p>
        </div>
      ) : (
        visibleSections.map((id, i) =>
          SECTION_RENDERERS[id](
            user,
            id,
            String(i + 1).padStart(2, "0"),
            i === visibleSections.length - 1,
          ),
        )
      )}

      <FooterCta email={user.email} />
    </div>
  );
}
