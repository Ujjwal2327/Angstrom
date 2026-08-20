// components/profile/ProjectsGrid.js
"use client";

import { useMemo, useState } from "react";
import ProjectCard from "@/components/profile/ProjectCard";

export default function ProjectsGrid({ projects }) {
  const categories = useMemo(() => {
    const seen = new Set();
    projects.forEach((p) => {
      if (p.category?.trim()) seen.add(p.category.trim());
    });
    return [...seen];
  }, [projects]);

  // A filter only earns its place once picking a category would actually
  // change what's shown — i.e. at least one category covers *some* but not
  // *all* projects. Covers both "2 different named categories" and the more
  // common case: a single category (e.g. "Client Work") on some projects
  // with the rest left untagged. If every project shares that one category
  // (or none do), every pill would show the same thing as "All" — nothing
  // worth filtering yet.
  const showFilter = useMemo(
    () =>
      categories.some(
        (cat) =>
          projects.filter((p) => p.category?.trim() === cat).length <
          projects.length,
      ),
    [categories, projects],
  );
  const [activeCategory, setActiveCategory] = useState("all");

  const visibleProjects =
    !showFilter || activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category?.trim() === activeCategory);

  return (
    <div>
      {showFilter && (
        <div
          role="tablist"
          aria-label="Filter projects by category"
          className="flex flex-wrap gap-2 mb-6"
        >
          {["all", ...categories].map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full font-mono text-[0.65rem] uppercase tracking-wider transition-all duration-150 border ${
                  isActive
                    ? "bg-primary/15 text-primary border-primary/25"
                    : "text-muted-foreground border-border hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-12 gap-4 sm:gap-5 min-w-0">
        {visibleProjects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </div>
  );
}
