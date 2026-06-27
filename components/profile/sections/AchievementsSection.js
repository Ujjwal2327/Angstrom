"use client";
// components/profile/sections/AchievementsSection.js
//
// Next.js 16 disallows dynamic({ ssr: false }) in Server Components.
// This component needs it because Tiptap/ProseMirror requires the DOM.
// "use client" makes this a Client Component so the dynamic import is legal.

import dynamic from "next/dynamic";
import Loader from "@/components/ui/Loader";
import SectionShell from "@/components/profile/SectionShell";

const Tiptap = dynamic(() => import("@/components/Tiptap/Tiptap"), {
  ssr: false,
  loading: () => <Loader />,
});

export default function AchievementsSection({ id, index, achievements }) {
  return (
    <SectionShell id={id} index={index} title="achievements">
      <div className="max-w-3xl text-foreground/90 leading-relaxed text-[clamp(1rem,1.8vw,1.2rem)]">
        {/* No onChange → Tiptap renders read-only, toolbar-free */}
        <Tiptap desc={achievements} />
      </div>
    </SectionShell>
  );
}
