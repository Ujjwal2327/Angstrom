// components/profile/sections/AboutSection.js
import SectionShell from "@/components/profile/SectionShell";

export default function AboutSection({ id, index, about }) {
  return (
    <SectionShell id={id} index={index} title="about">
      <p
        className="font-medium leading-relaxed tracking-tight text-foreground/90 max-w-3xl whitespace-pre-wrap text-[clamp(1.2rem,2.4vw,1.85rem)]"
        // Slightly wider letter-spacing for readability at large sizes
        style={{ letterSpacing: "-0.01em" }}
      >
        {about}
      </p>
    </SectionShell>
  );
}
