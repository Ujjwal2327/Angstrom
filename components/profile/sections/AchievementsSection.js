// components/profile/sections/AchievementsSection.js
//
// BUGFIX (AI / SEO fetchability): this used to render through a client-only
// Tiptap instance (dynamic(..., { ssr: false })), even though nothing here
// is ever editable in this read-only view. That meant the achievements HTML
// was ABSENT from the server-rendered page entirely and only appeared after
// a client-side mount — anything that reads the page without executing JS
// (most scrapers, and plenty of AI "fetch this URL" tools) saw nothing here.
// Read-only Tiptap never needed the DOM editor in the first place, since
// it's just displaying static HTML, so this renders that HTML directly and
// stays a plain Server Component instead. `achievements` is sanitized
// server-side before it's ever saved (see lib/sanitizeHtml.js), so it's
// safe to render as-is here.
import SectionShell from "@/components/profile/SectionShell";

export default function AchievementsSection({
  id,
  index,
  achievements,
  noBorder,
}) {
  return (
    <SectionShell
      id={id}
      index={index}
      title="highlights"
      was="achievements"
      noBorder={noBorder}
    >
      <div
        className="rich-text max-w-3xl text-foreground/90 leading-relaxed text-[clamp(1rem,1.8vw,1.2rem)]"
        dangerouslySetInnerHTML={{ __html: achievements }}
      />
    </SectionShell>
  );
}
