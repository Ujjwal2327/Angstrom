// app/users/[username]/page.js

import { getUserByEmail, getUserByUsername } from "@/action/user";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { capitalizeString } from "@/utils";
import ProfileHero from "@/components/profile/ProfileHero";
import DotNav from "@/components/profile/DotNav";
import AboutSection from "@/components/profile/sections/AboutSection";
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
  const sections = [
    { id: "about", label: "about", show: Boolean(user.about) },
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
            // nothing here yet
          </p>
        </div>
      ) : (
        <>
          {user.about && (
            <AboutSection id="about" index="01" about={user.about} />
          )}

          {user.experience?.length > 0 && (
            <ExperienceSection
              id="experience"
              index="02"
              experience={user.experience}
            />
          )}

          {user.projects?.length > 0 && (
            <ProjectsSection
              id="projects"
              index="03"
              projects={user.projects}
            />
          )}

          {user.education?.length > 0 && (
            <EducationSection
              id="education"
              index="04"
              education={user.education}
            />
          )}

          {user.skills?.length > 0 && (
            <SkillsSection
              id="skills"
              index="05"
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
