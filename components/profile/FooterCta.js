// components/profile/FooterCta.js

import Link from "next/link";

export default function FooterCta({ email }) {
  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-20 text-center">
      <Link
        href={`mailto:${email}`}
        className="font-mono text-sm text-muted-foreground hover:text-primary border-b border-border hover:border-primary pb-1 transition-colors"
      >
        let&apos;s build something — say hello ↗
      </Link>
    </div>
  );
}
