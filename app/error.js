"use client";
// app/error.js
//
// Without this file, any unhandled Server Component error that doesn't
// match notFound() still ends up rendering not-found.js as a fallback —
// making runtime errors look like "page not found" when they're actually
// something else (DB timeout, Prisma error, etc.).
//
// This error boundary catches those cases and shows a specific recovery UI
// with a retry button rather than silently masking the real problem.

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, Home } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log to your error tracking service here (Sentry, etc.)
    console.error("[App Error]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] -m-10 px-5">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Error badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-destructive/30 bg-destructive/5 font-mono text-xs text-destructive uppercase tracking-widest">
          <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
          runtime error
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h2 className="font-black text-2xl tracking-tight">
            Something went wrong
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            An unexpected error occurred. This has been logged. You can try
            again or return to the home page.
          </p>
        </div>

        {/* Error detail (dev only) */}
        {process.env.NODE_ENV === "development" && error?.message && (
          <pre className="text-left text-xs text-destructive/80 bg-destructive/5 border border-destructive/20 rounded-lg p-4 overflow-auto max-h-32 font-mono">
            {error.message}
          </pre>
        )}

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-mono text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            <RotateCcw size={14} />
            try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-muted-foreground font-mono text-sm rounded-lg hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            <Home size={14} />
            home
          </Link>
        </div>
      </div>
    </div>
  );
}
