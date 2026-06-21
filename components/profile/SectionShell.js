// components/profile/SectionShell.js

export default function SectionShell({ id, index, title, children, noBorder }) {
  return (
    <section
      id={id}
      className={`relative max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-24 scroll-mt-16 lg:scroll-mt-0 ${
        noBorder ? "" : "border-b border-border"
      }`}
    >
      <span
        aria-hidden="true"
        className="absolute top-4 left-5 sm:left-8 font-mono font-bold leading-none select-none pointer-events-none text-[clamp(4.5rem,14vw,11rem)]"
        style={{ color: "hsl(var(--foreground) / 0.035)" }}
      >
        {index}
      </span>
      <div className="relative z-10">
        <div className="font-mono text-sm uppercase tracking-[0.12em] text-primary mb-10 sm:mb-12">
          {/* BUGFIX: was bare text `// {title}` — a literal "//" text node
              right next to a JSX expression reads as an accidental comment
              to ESLint's react/jsx-no-comment-textnodes rule and fails the
              build. Combining into one template-literal expression makes
              the intent (stylized text, not a forgotten comment) explicit. */}
          {`// ${title}`}
        </div>
        {children}
      </div>
    </section>
  );
}
