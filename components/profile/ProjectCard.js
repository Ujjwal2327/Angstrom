// components/profile/ProjectCard.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { Github, ArrowUpRight, Eye } from "lucide-react";
import { getProjectPreview } from "@/lib/projectPreview";

// Asymmetric 12-col span cycling every 4 cards
const SPAN_PATTERN = [
  "sm:col-span-7",
  "sm:col-span-5",
  "sm:col-span-5",
  "sm:col-span-7",
];

export default function ProjectCard({ project, index }) {
  const { previewUrl, isLive } = getProjectPreview(project);
  const [imgState, setImgState] = useState("loading"); // "loading" | "loaded" | "failed"
  const hasLiveUrl = project.live_url && project.live_url !== project.code_url;
  const primaryHref = hasLiveUrl ? project.live_url : project.code_url;

  return (
    <article
      className={`group relative col-span-12 ${SPAN_PATTERN[index % 4]} min-w-0 border border-border hover:border-primary/40 transition-all duration-300 overflow-hidden flex flex-col bg-card hover:shadow-xl hover:shadow-black/20`}
    >
      {/* Preview image area */}
      <Link
        href={primaryHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${project.name} ${hasLiveUrl ? "live site" : "repository"}`}
        className="relative block w-full aspect-video bg-muted overflow-hidden border-b border-border"
      >
        {/* Skeleton shimmer while image loads */}
        {imgState === "loading" && previewUrl && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted via-muted/60 to-muted bg-[length:200%_100%]" />
        )}

        {/* Live badge */}
        {isLive && imgState !== "failed" && (
          <span className="absolute top-3 left-3 z-10 flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-wide glass px-2 py-1 text-foreground/80">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            live
          </span>
        )}

        {previewUrl && imgState !== "failed" ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt={`${project.name} preview`}
              loading="lazy"
              onLoad={() => setImgState("loaded")}
              onError={() => setImgState("failed")}
              className={`w-full h-full object-cover object-top saturate-90 transition-all duration-500 group-hover:scale-[1.03] ${
                imgState === "loaded" ? "opacity-100" : "opacity-0"
              }`}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent pointer-events-none" />
          </>
        ) : (
          /* Fallback placeholder */
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground/30"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, hsl(var(--border) / 0.3) 0, hsl(var(--border) / 0.3) 1px, transparent 1px, transparent 14px)",
            }}
          >
            <Eye size={20} />
            <span className="font-mono text-[10px]">preview unavailable</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300 pointer-events-none" />
      </Link>

      {/* Card body */}
      <div className="relative p-5 sm:p-6 flex-1 flex flex-col min-w-0">
        <h3 className="font-extrabold tracking-tight text-[clamp(1.1rem,1.6vw,1.4rem)] mb-2 break-words">
          {project.name}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
          {project.about}
        </p>

        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3 mt-4 pt-4 border-t border-border/60">
          {/* Skill tags */}
          {project.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 min-w-0">
              {project.skills.slice(0, 5).map((skill) => (
                <span
                  key={skill}
                  className="font-mono text-[10px] text-muted-foreground/70 bg-muted/50 px-1.5 py-0.5 rounded-sm"
                >
                  {skill}
                </span>
              ))}
              {project.skills.length > 5 && (
                <span className="font-mono text-[10px] text-muted-foreground/50">
                  +{project.skills.length - 5}
                </span>
              )}
            </div>
          )}

          {/* Action links */}
          <div className="flex gap-1.5 flex-shrink-0 ml-auto">
            <Link
              href={project.code_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all duration-150 hover:bg-primary/5"
              aria-label={`${project.name} source code on GitHub`}
            >
              <Github size={13} />
            </Link>
            {hasLiveUrl && (
              <Link
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all duration-150 hover:bg-primary/5"
                aria-label={`${project.name} live demo`}
              >
                <ArrowUpRight size={13} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
