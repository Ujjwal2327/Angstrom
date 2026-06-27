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
        // Pick the topmost visible section
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
      {/* ── Desktop: floating dot nav on the right ─────────────────────── */}
      <nav
        aria-label="Profile sections"
        className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 flex-col gap-4"
      >
        {sections.map((section) => {
          const isActive = section.id === activeId;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={(e) => handleClick(e, section.id)}
              className="group relative flex items-center justify-end gap-2"
              aria-label={`Jump to ${section.label}`}
              aria-current={isActive ? "true" : undefined}
            >
              {/* Tooltip label */}
              <span
                className={`font-mono text-[0.65rem] uppercase tracking-wider whitespace-nowrap bg-card border border-border text-foreground px-2 py-1 rounded-sm transition-all duration-200 ${
                  isActive
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                }`}
              >
                {section.label}
              </span>

              {/* Dot */}
              <span
                className={`flex-shrink-0 rounded-full transition-all duration-250 ${
                  isActive
                    ? "w-2.5 h-2.5 bg-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.15)]"
                    : "w-1.5 h-1.5 bg-border group-hover:bg-muted-foreground"
                }`}
              />
            </a>
          );
        })}
      </nav>

      {/* ── Mobile: sticky horizontal pill tabs ────────────────────────── */}
      <nav
        aria-label="Profile sections"
        className="lg:hidden sticky top-14 z-30 bg-background/95 backdrop-blur border-b border-border"
      >
        <ol
          className="flex gap-1 px-4 sm:px-6 py-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
        >
          {sections.map((section) => {
            const isActive = section.id === activeId;
            return (
              <li key={section.id} role="presentation">
                <a
                  href={`#${section.id}`}
                  onClick={(e) => handleClick(e, section.id)}
                  role="tab"
                  aria-selected={isActive}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[0.65rem] uppercase tracking-wider whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? "bg-primary/15 text-primary border border-primary/25"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {isActive && (
                    <span
                      className="w-1 h-1 rounded-full bg-primary flex-shrink-0"
                      aria-hidden="true"
                    />
                  )}
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
