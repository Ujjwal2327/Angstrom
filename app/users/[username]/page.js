// app/users/[username]/page.js

import { getUserByEmail, getUserByUsername } from "@/action/user";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { capitalizeString } from "@/utils";
import ProfileHero from "@/components/profile/ProfileHero";
import DotNav from "@/components/profile/DotNav";
import AboutSection from "@/components/profile/sections/AboutSection";
import AchievementsSection from "@/components/profile/sections/AchievementsSection";
import ExperienceSection from "@/components/profile/sections/ExperienceSection";
import ProjectsSection from "@/components/profile/sections/ProjectsSection";
import EducationSection from "@/components/profile/sections/EducationSection";
import SkillsSection from "@/components/profile/sections/SkillsSection";
import FooterCta from "@/components/profile/FooterCta";

export function generateMetadata({ params }) {
  const username = decodeURIComponent(params.username);
  return {
    title: `${capitalizeString(username)}'s Portfolio | Angstrom`,
    description: `View the portfolio of ${capitalizeString(username)}.`,
  };
}

export default async function UserPage({ params }) {
  params.username = decodeURIComponent(params.username);
  const session = await auth();
  const viewer = await getUserByEmail(session?.user?.email);
  const user = await getUserByUsername(params.username);
  if (!user) notFound();

  const isOwner = params.username === viewer?.username;

  // Drives both the floating dot-nav and the render order, so they can never drift apart.
  // BUGFIX: `achievements` was being captured and saved by the edit form
  // (Tiptap editor, full schema validation, the works) but never rendered
  // anywhere on the actual public profile — the data went in and just
  // vanished from view. Added here, positioned right after "about" to match
  // where it sits in the edit form's own section order.
  const sections = [
    { id: "about", label: "about", show: Boolean(user.about) },
    {
      id: "achievements",
      label: "achievements",
      show: Boolean(user.achievements?.trim()),
    },
    {
      id: "experience",
      label: "experience",
      show: Boolean(user.experience?.length),
    },
    { id: "projects", label: "projects", show: Boolean(user.projects?.length) },
    {
      id: "education",
      label: "education",
      show: Boolean(user.education?.length),
    },
    { id: "skills", label: "skills", show: Boolean(user.skills?.length) },
  ].filter((s) => s.show);

  // BUGFIX: indexes were hardcoded literals ("01", "02", "03"...), so
  // hiding any one section (e.g. a user with no achievements) left every
  // section after it showing the wrong number — experience would still say
  // "03" even though it's actually the 2nd section on the page. Deriving
  // each section's index from its position in the already-filtered
  // `sections` array keeps the numbering sequential and gap-free no matter
  // which sections a given user happens to have.
  const sectionIndexById = Object.fromEntries(
    sections.map((s, i) => [s.id, String(i + 1).padStart(2, "0")]),
  );

  return (
    <div className="-m-10 overflow-x-hidden">
      <DotNav sections={sections} />

      <ProfileHero
        user={user}
        isOwner={isOwner}
        isCreator={user.username === process.env.MY_USERNAME}
      />

      {sections.length === 0 ? (
        <div className="max-w-5xl mx-auto px-8 py-24 text-center">
          <p className="font-mono text-xs text-muted-foreground tracking-wide">
            {"// nothing here yet"}
          </p>
        </div>
      ) : (
        <>
          {user.about && (
            <AboutSection
              id="about"
              index={sectionIndexById.about}
              about={user.about}
            />
          )}

          {user.achievements?.trim() && (
            <AchievementsSection
              id="achievements"
              index={sectionIndexById.achievements}
              achievements={user.achievements}
            />
          )}

          {user.experience?.length > 0 && (
            <ExperienceSection
              id="experience"
              index={sectionIndexById.experience}
              experience={user.experience}
            />
          )}

          {user.projects?.length > 0 && (
            <ProjectsSection
              id="projects"
              index={sectionIndexById.projects}
              projects={user.projects}
            />
          )}

          {user.education?.length > 0 && (
            <EducationSection
              id="education"
              index={sectionIndexById.education}
              education={user.education}
            />
          )}

          {user.skills?.length > 0 && (
            <SkillsSection
              id="skills"
              index={sectionIndexById.skills}
              skills={user.skills}
              noBorder
            />
          )}
        </>
      )}

      <FooterCta email={user.email} />
    </div>
  );
}
