// app/not-found.js
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

export function generateMetadata() {
  return {
    title: "404 — Page Not Found | Angstrom",
    description: "The page you're looking for doesn't exist.",
  };
}

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] -m-10 px-5 bg-background">
      {/* Terminal window */}
      <div className="w-full max-w-lg border border-border rounded-xl overflow-hidden shadow-2xl shadow-black/40">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-card border-b border-border">
          <div className="w-3 h-3 rounded-full bg-destructive/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-success/70" />
          <span className="ml-2 font-mono text-xs text-muted-foreground/60 tracking-wide">
            angstrom — bash
          </span>
        </div>

        {/* Terminal body */}
        <div className="bg-[hsl(200_25%_5%)] p-6 font-mono text-sm space-y-1 min-h-52">
          <p className="text-muted-foreground/50">$ angstrom navigate</p>
          <p className="text-muted-foreground/50">{">"} resolving route...</p>
          <p className="text-muted-foreground/50">{">"} looking up page...</p>
          <div className="mt-3 space-y-1">
            <p>
              <span className="text-destructive font-bold">error</span>
              <span className="text-muted-foreground">: PageNotFoundError</span>
            </p>
            <p className="text-muted-foreground/70">
              {"  "}at Router.resolve (angstrom/core)
            </p>
            <p className="text-muted-foreground/70">
              {"  "}code: <span className="text-primary">404</span>
            </p>
            <p className="text-muted-foreground/70">
              {"  "}message:{" "}
              <span className="text-foreground/80">
                &quot;The requested route does not exist.&quot;
              </span>
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-border/30 space-y-1 text-muted-foreground/50">
            <p>
              <span className="text-primary/70">#</span> suggested fixes:
            </p>
            <p>
              <span className="text-primary/70">#</span>
              {"  "}check the URL for typos
            </p>
            <p>
              <span className="text-primary/70">#</span>
              {"  "}navigate back to{" "}
              <Link
                href="/"
                className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
              >
                /home
              </Link>
            </p>
          </div>
          {/* Blinking cursor */}
          <div className="flex items-center gap-1 mt-3">
            <span className="text-muted-foreground/50">$</span>
            <span
              className="w-2 h-4 bg-primary/70 animate-pulse"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-mono text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors duration-150"
        >
          <ArrowLeft size={15} />
          return home
        </Link>

        {/* BackButton is a Client Component so it can call router.back().
            Previously this was <Link href="javascript:history.back()"> which
            Next.js treated as a route navigation to a non-existent path,
            causing an infinite 404 loop. */}
        <BackButton className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-muted-foreground font-mono text-sm rounded-lg hover:text-foreground hover:border-foreground/30 transition-colors duration-150" />
      </div>
    </div>
  );
}
