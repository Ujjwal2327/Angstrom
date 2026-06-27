// components/profile/sections/EducationSection.js
import SectionShell from "@/components/profile/SectionShell";

export default function EducationSection({ id, index, education }) {
  return (
    <SectionShell id={id} index={index} title="education">
      <div className="min-w-0 space-y-0">
        {education.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 sm:gap-6 py-7 border-t border-border last:border-b min-w-0 transition-colors duration-200 hover:bg-primary/[0.03] -mx-5 sm:-mx-8 px-5 sm:px-8"
          >
            <div className="min-w-0 flex-1">
              {/* Degree + specialization */}
              <h3 className="font-bold text-[clamp(1rem,1.8vw,1.3rem)] leading-snug break-words">
                {item.degree}
                {item.specialization && (
                  <span className="text-muted-foreground font-normal text-base">
                    {" "}
                    · {item.specialization}
                  </span>
                )}
              </h3>

              {/* Institution + score */}
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-sm text-muted-foreground break-words">
                  {item.institution}
                </span>
                {item.score && (
                  <span className="font-mono text-xs text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-sm">
                    {item.score}
                  </span>
                )}
              </div>
            </div>

            {/* Date range */}
            <span className="font-mono text-xs text-muted-foreground/70 whitespace-nowrap flex-shrink-0 tabular-nums">
              {item.start} — {item.end || "Present"}
            </span>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
