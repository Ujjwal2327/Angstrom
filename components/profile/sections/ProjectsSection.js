// components/profile/sections/ProjectsSection.js
import SectionShell from "@/components/profile/SectionShell";
import ProjectsGrid from "@/components/profile/ProjectsGrid";

export default function ProjectsSection({ id, index, projects, noBorder }) {
  return (
    <SectionShell
      id={id}
      index={index}
      title="proof of work"
      was="projects"
      noBorder={noBorder}
    >
      <ProjectsGrid projects={projects} />
    </SectionShell>
  );
}
