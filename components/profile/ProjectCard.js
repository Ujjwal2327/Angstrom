// components/profile/ProjectCard.js

"use client";
import { useState } from "react";
import Link from "next/link";
import { Github, ArrowUpRight } from "lucide-react";
import { getProjectPreview } from "@/lib/projectPreview";

// Asymmetric 12-col span pattern, cycling every 4 cards so longer lists
// still alternate rather than defaulting to a uniform grid past the 4th item.
const SPAN_PATTERN = [
  "sm:col-span-7",
  "sm:col-span-5",
  "sm:col-span-5",
  "sm:col-span-7",
];

export default function ProjectCard({ project, index }) {
  const { previewUrl, isLive } = getProjectPreview(project);
  const [imgFailed, setImgFailed] = useState(false);
  const hasLiveUrl = project.live_url && project.live_url !== project.code_url;
  const primaryHref = hasLiveUrl ? project.live_url : project.code_url;

  return (
    <div
      className={`group relative col-span-12 ${SPAN_PATTERN[index % 4]} min-w-0 border border-border hover:border-primary/50 transition-colors overflow-hidden flex flex-col`}
    >
      <Link
        href={primaryHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`open ${project.name} ${hasLiveUrl ? "live site" : "repository"}`}
        className="relative block w-full aspect-video bg-secondary border-b border-border overflow-hidden"
      >
        {previewUrl && !imgFailed ? (
          <>
            {isLive && (
              <span className="absolute top-3 left-3 z-10 flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-wide bg-background/85 backdrop-blur border border-border text-muted-foreground px-2 py-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                </span>
                live
              </span>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt={`${project.name} preview`}
              loading="lazy"
              onError={() => setImgFailed(true)}
              className="w-full h-full object-cover object-top saturate-[0.9] transition-transform duration-500 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/85 to-transparent pointer-events-none" />
          </>
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center font-mono text-xs text-muted-foreground"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, hsl(var(--border) / 0.4) 0, hsl(var(--border) / 0.4) 1px, transparent 1px, transparent 14px)",
            }}
          >
            preview unavailable
          </div>
        )}
      </Link>

      <div className="relative p-6 flex-1 flex flex-col min-w-0">
        <h3 className="font-extrabold tracking-tight text-[clamp(1.2rem,1.8vw,1.55rem)] mb-2 break-words">
          {project.name}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">
          {project.about}
        </p>

        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3 mt-5">
          {project.skills?.length > 0 && (
            <span className="font-mono text-xs text-muted-foreground min-w-0 break-words">
              {project.skills.join(" · ")}
            </span>
          )}
          <div className="flex gap-2 flex-shrink-0 ml-auto">
            <Link
              href={project.code_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[30px] h-[30px] flex items-center justify-center border border-border text-foreground hover:border-primary hover:text-primary transition-colors"
              aria-label={`${project.name} source code`}
            >
              <Github size={14} />
            </Link>
            {hasLiveUrl && (
              <Link
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-[30px] h-[30px] flex items-center justify-center border border-border text-foreground hover:border-primary hover:text-primary transition-colors"
                aria-label={`${project.name} live demo`}
              >
                <ArrowUpRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
