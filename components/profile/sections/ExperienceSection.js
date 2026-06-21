// components/profile/sections/ExperienceSection.js

import SectionShell from "@/components/profile/SectionShell";

export default function ExperienceSection({ id, index, experience }) {
  return (
    <SectionShell id={id} index={index} title="experience">
      <div className="min-w-0">
        {experience.map((item) => (
          <div
            key={item.id}
            className="group grid grid-cols-1 sm:grid-cols-[7rem_1fr] items-baseline gap-x-6 gap-y-1 py-7 px-0 -mx-5 sm:-mx-6 px-5 sm:px-6 border-t border-border last:border-b transition-[padding,background] duration-300 hover:bg-primary/[0.06] hover:pl-7 sm:hover:pl-9 min-w-0"
          >
            <span className="font-mono text-xs text-muted-foreground whitespace-nowrap order-2 sm:order-1">
              {item.start} — {item.end || "Present"}
            </span>

            <div className="order-1 sm:order-2 min-w-0">
              <h3 className="font-bold tracking-tight text-[clamp(1.15rem,2vw,1.6rem)] break-words">
                {item.position}
                {item.company && (
                  <span className="text-muted-foreground font-normal">
                    {" "}
                    · {item.company}
                  </span>
                )}
              </h3>

              {item.about && (
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xl break-words sm:max-h-0 sm:opacity-0 sm:overflow-hidden sm:group-hover:max-h-24 sm:group-hover:opacity-100 sm:group-hover:mt-2 transition-[max-height,opacity,margin-top] duration-300">
                  {item.about}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
