"use client";
// components/ui/BackButton.js
//
// Extracted so not-found.js can remain a Server Component (enabling
// generateMetadata) while still having a functional browser back button.
//
// Previously not-found.js used <Link href="javascript:history.back()">.
// Next.js Link treats that as a real route → navigates to a non-existent
// path → shows the 404 page again → infinite 404 loop.

import { useRouter } from "next/navigation";

export default function BackButton({ className }) {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} className={className}>
      go back
    </button>
  );
}
