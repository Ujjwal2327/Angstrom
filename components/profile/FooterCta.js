// components/profile/FooterCta.js
import Link from "next/link";

export default function FooterCta({ email }) {
  return (
    <footer className="max-w-5xl mx-auto px-5 sm:px-8 py-24 sm:py-32">
      {/* Horizontal rule with glow */}
      <div className="relative mb-12">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 bg-background font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
            eof
          </span>
        </div>
      </div>

      {/* CTA block */}
      <div className="text-center space-y-4">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground/50">
          get in touch
        </p>
        <Link
          href={`mailto:${email}`}
          className="block font-black text-[clamp(1.5rem,5vw,3rem)] tracking-tight text-foreground/80 hover:text-primary transition-colors duration-200 leading-tight"
        >
          {email}
        </Link>
        <p className="text-sm text-muted-foreground/50 font-mono">
          — open to opportunities, collaborations, and interesting conversations
        </p>
      </div>
    </footer>
  );
}
