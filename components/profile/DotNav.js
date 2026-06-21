// components/profile/DotNav.js

"use client";
import { useEffect, useRef, useState } from "react";

export default function DotNav({ sections }) {
  const [activeId, setActiveId] = useState(sections[0]?.id);
  const observerRef = useRef(null);

  useEffect(() => {
    if (sections.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
        );
        setActiveId(topMost.target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 },
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [sections]);

  if (sections.length === 0) return null;

  const handleClick = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        aria-label="Profile sections"
        className="hidden lg:flex fixed right-9 top-1/2 -translate-y-1/2 z-40 flex-col gap-[1.1rem]"
      >
        {sections.map((section) => {
          const isActive = section.id === activeId;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={(e) => handleClick(e, section.id)}
              className="group relative flex items-center justify-end"
            >
              <span
                className={`absolute right-4 font-mono text-[0.7rem] whitespace-nowrap bg-card border border-border text-foreground px-2 py-0.5 rounded-sm transition-all duration-200 ${
                  isActive
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0"
                }`}
              >
                {section.label}
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full transition-all duration-250 ${
                  isActive
                    ? "bg-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.15)]"
                    : "bg-border"
                }`}
              />
            </a>
          );
        })}
      </nav>

      <nav
        aria-label="Profile sections"
        className="lg:hidden sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border overflow-x-auto"
      >
        <ol className="flex gap-5 px-5 sm:px-8 py-3 whitespace-nowrap max-w-[1400px] mx-auto">
          {sections.map((section) => {
            const isActive = section.id === activeId;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={(e) => handleClick(e, section.id)}
                  className={`flex items-baseline gap-1.5 text-sm transition-colors ${
                    isActive
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? "bg-primary" : "bg-border"
                    }`}
                  />
                  {section.label}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
