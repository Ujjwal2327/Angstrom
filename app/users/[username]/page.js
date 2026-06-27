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

export default async function UserPage({ params }) {
  const { username: raw } = await params;
  const username = decodeURIComponent(raw);

  // Parallel fetch: don't wait for auth before starting the profile lookup.
  // Both are independent — fetching them concurrently halves the waterfall.
  const session = await auth();
  const [viewer, user] = await Promise.all([
    getUserByEmail(session?.user?.email),
    getUserByUsername(username),
  ]);

  if (!user) notFound();

  const isOwner = username === viewer?.username;

  // Single source of truth: drives both DotNav and section render order.
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

  // Sequential index derived from the filtered list — no hardcoded numbers.
  const indexById = Object.fromEntries(
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
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-32 text-center">
          <p className="font-mono text-xs text-muted-foreground/50 tracking-widest">
            {"// nothing here yet"}
          </p>
        </div>
      ) : (
        <>
          {user.about && (
            <AboutSection
              id="about"
              index={indexById.about}
              about={user.about}
            />
          )}
          {user.achievements?.trim() && (
            <AchievementsSection
              id="achievements"
              index={indexById.achievements}
              achievements={user.achievements}
            />
          )}
          {user.experience?.length > 0 && (
            <ExperienceSection
              id="experience"
              index={indexById.experience}
              experience={user.experience}
            />
          )}
          {user.projects?.length > 0 && (
            <ProjectsSection
              id="projects"
              index={indexById.projects}
              projects={user.projects}
            />
          )}
          {user.education?.length > 0 && (
            <EducationSection
              id="education"
              index={indexById.education}
              education={user.education}
            />
          )}
          {user.skills?.length > 0 && (
            <SkillsSection
              id="skills"
              index={indexById.skills}
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
