// components/profile/sections/SkillsSection.js

import SectionShell from "@/components/profile/SectionShell";

// Visual weight is purely a function of position in the user's own ordering —
// nothing inferred from project usage or alphabetized. Skills listed first
// get the most visual weight because the user put them first on purpose.
function weightClassFor(index, total) {
  const ratio = index / Math.max(total - 1, 1);
  if (ratio < 0.2) return "text-3xl sm:text-4xl font-extrabold opacity-100";
  if (ratio < 0.45) return "text-2xl sm:text-3xl font-bold opacity-90";
  if (ratio < 0.75) return "text-xl sm:text-2xl font-semibold opacity-75";
  return "text-lg sm:text-xl font-medium opacity-55";
}

export default function SkillsSection({ id, index, skills, noBorder }) {
  return (
    <SectionShell id={id} index={index} title="skills" noBorder={noBorder}>
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-3 max-w-4xl">
        {skills.map((skill, i) => (
          <span
            key={skill}
            className={`relative cursor-default tracking-tight text-foreground transition-colors hover:text-primary ${weightClassFor(
              i,
              skills.length,
            )}`}
          >
            {skill}
          </span>
        ))}
      </div>
    </SectionShell>
  );
}
