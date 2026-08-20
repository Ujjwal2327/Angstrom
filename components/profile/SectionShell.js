// components/profile/SectionShell.js
//
// `was` is optional. When present, the heading shows the plain/expected
// word struck through immediately before the real `title` — e.g.
// "// achievements  highlights", with "achievements" crossed out — instead
// of the plain "// {title}" this always rendered before. Every other prop
// behaves exactly as it did.

export default function SectionShell({
  id,
  index,
  title,
  was,
  children,
  noBorder,
}) {
  return (
    <section
      id={id}
      // scroll-mt-28 on mobile: fixed navbar (56px) + sticky mobile tab bar (~56px)
      // scroll-mt-20 on lg: fixed navbar (56px) + breathing room
      className={`relative max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-24 scroll-mt-28 lg:scroll-mt-20 ${
        noBorder ? "" : "border-b border-border"
      }`}
    >
      {/* Ghost index number — decorative watermark */}
      <span aria-hidden="true" className="section-num top-4 left-5 sm:left-8">
        {index}
      </span>

      <div className="relative z-10">
        {/* // section-title label */}
        <div className="mono-label mb-10 sm:mb-14 flex items-baseline gap-x-2 flex-wrap">
          {was ? (
            <>
              <s className="font-normal text-muted-foreground/35">{`// ${was}`}</s>
              <span>{title}</span>
            </>
          ) : (
            `// ${title}`
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
