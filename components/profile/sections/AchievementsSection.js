// components/profile/sections/AchievementsSection.js

import SectionShell from "@/components/profile/SectionShell";
import Loader from "@/components/ui/Loader";
import dynamic from "next/dynamic";

// Same dynamic/ssr:false pattern already used for Tiptap in the edit form
// (components/forms/ProfileForm/sections/AchievementsSection.js) and for
// other heavy client-only editors in this app (CodeHighlighter, CodeSnapshot,
// MarkdownEditor) — ProseMirror needs the DOM, so it can't render on the
// server.
const Tiptap = dynamic(() => import("@/components/Tiptap/Tiptap"), {
  ssr: false,
  loading: () => <Loader />,
});

export default function AchievementsSection({ id, index, achievements }) {
  return (
    <SectionShell id={id} index={index} title="achievements">
      <div className="max-w-3xl text-foreground/90 leading-relaxed text-[clamp(1rem,1.8vw,1.2rem)]">
        {/* No `onChange` passed in -> Tiptap renders in read-only mode,
            toolbar-free, matching exactly what the user wrote in the editor. */}
        <Tiptap desc={achievements} />
      </div>
    </SectionShell>
  );
}
