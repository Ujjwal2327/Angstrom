// components/profile/sections/ProjectsSection.js

import SectionShell from "@/components/profile/SectionShell";
import ProjectCard from "@/components/profile/ProjectCard";

export default function ProjectsSection({ id, index, projects }) {
  return (
    <SectionShell id={id} index={index} title="projects">
      <div className="grid grid-cols-12 gap-5 min-w-0">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </SectionShell>
  );
}
