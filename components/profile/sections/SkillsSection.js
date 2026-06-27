// components/profile/sections/SkillsSection.js
import SectionShell from "@/components/profile/SectionShell";

// Visual weight purely from the user's chosen order — first = largest, most prominent.
// Four tiers with opacity so the visual mass tapers naturally.
function weightClassFor(index, total) {
  const ratio = index / Math.max(total - 1, 1);
  if (ratio < 0.2)
    return "text-4xl sm:text-5xl font-black   opacity-100 tracking-tighter";
  if (ratio < 0.45)
    return "text-2xl sm:text-3xl font-bold    opacity-85  tracking-tight";
  if (ratio < 0.72) return "text-xl  sm:text-2xl font-semibold opacity-65";
  return "text-lg  sm:text-xl  font-medium  opacity-45";
}

export default function SkillsSection({ id, index, skills, noBorder }) {
  return (
    <SectionShell id={id} index={index} title="skills" noBorder={noBorder}>
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-3 max-w-4xl">
        {skills.map((skill, i) => (
          <span
            key={skill}
            className={`relative cursor-default select-none tracking-tight text-foreground transition-colors duration-150 hover:text-primary ${weightClassFor(i, skills.length)}`}
          >
            {skill}
          </span>
        ))}
      </div>
    </SectionShell>
  );
}
