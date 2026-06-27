// app/(auth)/sign-in/page.js
import { auth } from "@/auth";
import GoogleSignIn from "@/components/auth/GoogleSignIn";
import { permanentRedirect } from "next/navigation";
import Link from "next/link";
import {
  SquareDashedBottomCode,
  BookOpen,
  Braces,
  FileText,
} from "lucide-react";

export function generateMetadata() {
  return {
    title: "Sign In | Angstrom",
    description:
      "Sign in to access your Angstrom developer portfolio and tools.",
  };
}

const perks = [
  { icon: SquareDashedBottomCode, label: "Code Snapshot" },
  { icon: BookOpen, label: "Code Differ" },
  { icon: Braces, label: "JSON Slicer" },
  { icon: FileText, label: "Markdown Editor" },
];

export default async function SignInPage() {
  const session = await auth();
  if (session) permanentRedirect("/");

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)] -m-10 px-5">
      <div className="w-full max-w-sm space-y-4">
        {/* Card */}
        <div className="border border-border bg-card/80 backdrop-blur p-8 space-y-7">
          {/* Brand */}
          <div className="text-center space-y-1.5">
            <Link
              href="/"
              className="inline-block font-black text-4xl gradient-text"
            >
              Angstrom
            </Link>
            <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
              developer toolbox & portfolio builder
            </p>
          </div>

          {/* Tool grid */}
          <div className="grid grid-cols-2 gap-2">
            {perks.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-2 border border-border/60 bg-background/40 text-xs text-muted-foreground font-mono"
              >
                <Icon size={13} className="text-primary flex-shrink-0" />
                {label}
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-card text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50">
                continue with
              </span>
            </div>
          </div>

          {/* Sign-in button */}
          <GoogleSignIn isFull />
        </div>

        {/* Footer */}
        <p className="text-center font-mono text-[10px] text-muted-foreground/40 tracking-wide">
          no password · no credit card · free forever
        </p>
      </div>
    </div>
  );
}
