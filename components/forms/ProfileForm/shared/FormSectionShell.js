// components/forms/ProfileForm/shared/FormSectionShell.js

export default function FormSectionShell({
  index,
  title,
  description,
  children,
}) {
  return (
    <section className="relative py-14 sm:py-16 border-b border-border last:border-b-0">
      <span
        aria-hidden="true"
        className="absolute -top-2 left-0 font-mono font-bold leading-none select-none pointer-events-none text-[clamp(3.5rem,9vw,6rem)]"
        style={{ color: "hsl(var(--foreground) / 0.04)" }}
      >
        {index}
      </span>
      <div className="relative z-10">
        <div className="font-mono text-sm uppercase tracking-[0.12em] text-primary mb-1.5">
          // {title}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mb-8 max-w-xl">
            {description}
          </p>
        )}
        {!description && <div className="mb-8" />}
        {children}
      </div>
    </section>
  );
}
