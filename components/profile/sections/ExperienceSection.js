// components/profile/sections/ExperienceSection.js
import SectionShell from "@/components/profile/SectionShell";

export default function ExperienceSection({ id, index, experience }) {
  return (
    <SectionShell id={id} index={index} title="experience">
      <div className="relative min-w-0">
        {/* Vertical timeline rail on desktop */}
        <div
          className="hidden sm:block absolute left-[6.5rem] top-0 bottom-0 w-px bg-border"
          aria-hidden="true"
        />

        {experience.map((item, i) => (
          <div
            key={item.id}
            className="group relative grid grid-cols-1 sm:grid-cols-[7rem_1fr] gap-x-8 gap-y-1 py-7 border-t border-border last:border-b min-w-0 transition-colors duration-200 hover:bg-primary/[0.04] -mx-5 sm:-mx-8 px-5 sm:px-8"
          >
            {/* Timeline dot */}
            <div
              className="hidden sm:block absolute left-[6.5rem] top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-border bg-background transition-colors duration-200 group-hover:border-primary group-hover:bg-primary/30"
              aria-hidden="true"
            />

            {/* Date range */}
            <div className="font-mono text-xs text-muted-foreground whitespace-nowrap pt-0.5 order-2 sm:order-1 text-right sm:text-right">
              <span className="block">{item.start}</span>
              <span className="block opacity-60">—</span>
              <span className="block">{item.end || "Present"}</span>
            </div>

            {/* Role + company + description */}
            <div className="order-1 sm:order-2 min-w-0">
              <h3 className="font-bold tracking-tight text-[clamp(1.05rem,1.9vw,1.5rem)] leading-tight break-words">
                {item.position}
                {item.company && (
                  <span className="text-muted-foreground font-normal">
                    {" "}
                    · {item.company}
                  </span>
                )}
              </h3>

              {item.about && (
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xl break-words sm:max-h-0 sm:opacity-0 sm:overflow-hidden sm:group-hover:max-h-32 sm:group-hover:opacity-100 sm:group-hover:mt-2 transition-[max-height,opacity,margin-top] duration-300 ease-in-out">
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
