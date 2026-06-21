// components/profile/sections/EducationSection.js

import SectionShell from "@/components/profile/SectionShell";

export default function EducationSection({ id, index, education }) {
  return (
    <SectionShell id={id} index={index} title="education">
      <div className="min-w-0">
        {education.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5 py-6 border-t border-border last:border-b min-w-0"
          >
            <div className="min-w-0">
              <h3 className="font-bold text-lg sm:text-xl break-words">
                {item.degree}
                {item.specialization && (
                  <span className="text-muted-foreground font-normal">
                    {" "}
                    · {item.specialization}
                  </span>
                )}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-muted-foreground">
                <span className="break-words">{item.institution}</span>
                {item.score && (
                  <span className="font-mono text-xs text-primary">
                    {item.score}
                  </span>
                )}
              </div>
            </div>
            <span className="font-mono text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
              {item.start} — {item.end || "Present"}
            </span>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
