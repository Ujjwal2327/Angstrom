// components/profile/sections/AboutSection.js

import SectionShell from "@/components/profile/SectionShell";

export default function AboutSection({ id, index, about }) {
  return (
    <SectionShell id={id} index={index} title="about">
      <p className="font-medium leading-relaxed tracking-tight text-foreground/90 max-w-3xl whitespace-pre-wrap text-[clamp(1.3rem,2.6vw,2rem)]">
        {about}
      </p>
    </SectionShell>
  );
}
