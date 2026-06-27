import { auth } from "@/auth";
import { Spotlight } from "@/components/ui/Spotlight";
import { MagicButton } from "@/components/ui/MagicButton";
import { FaGoogle } from "react-icons/fa";
import { getUserByEmail } from "@/action/user";
import {
  Send,
  BookOpen,
  SquareDashedBottomCode,
  Braces,
  FileText,
  ArrowRight,
} from "lucide-react";
import { Suspense } from "react";
import Link from "next/link";

// Tool definitions — single source of truth for the feature cards
const tools = [
  {
    name: "Code Snapshot",
    path: "/code-snapshot",
    icon: SquareDashedBottomCode,
    description:
      "Beautiful screenshots of your code. 20+ themes, custom fonts, PNG & SVG export.",
    accent: "from-cyan-500/10 via-transparent to-transparent",
    iconColor: "text-cyan-400",
    border: "hover:border-cyan-500/30",
  },
  {
    name: "Code Differ",
    path: "/code-differ",
    icon: BookOpen,
    description:
      "Side-by-side diff viewer with full Monaco editor. 70+ languages supported.",
    accent: "from-blue-500/10 via-transparent to-transparent",
    iconColor: "text-blue-400",
    border: "hover:border-blue-500/30",
  },
  {
    name: "JSON Slicer",
    path: "/json-slicer",
    icon: Braces,
    description:
      "Visually select, filter and extract fields from any JSON structure.",
    accent: "from-violet-500/10 via-transparent to-transparent",
    iconColor: "text-violet-400",
    border: "hover:border-violet-500/30",
  },
  {
    name: "Markdown Editor",
    path: "/markdown-editor",
    icon: FileText,
    description:
      "Live markdown editor with GitHub README generator and Mermaid diagram support.",
    accent: "from-emerald-500/10 via-transparent to-transparent",
    iconColor: "text-emerald-400",
    border: "hover:border-emerald-500/30",
  },
];

export default function Hero() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-large-white/[0.03] pointer-events-none" />

      {/* Radial fade over grid */}
      <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black_80%)] bg-background" />

      {/* Spotlights */}
      <Spotlight
        className="-top-40 -left-10 md:-left-32 md:-top-96"
        fill="cyan"
      />
      <Spotlight
        className="absolute left-32 -top-20 hidden sm:block"
        fill="purple"
      />
      <Spotlight
        className="absolute left-80 -top-28 h-[80vh] w-[50vw] hidden sm:block"
        fill="blue"
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-5 pt-24 pb-32 text-center max-w-5xl w-full mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary font-mono text-xs uppercase tracking-widest animate-fade-in">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Developer Toolbox & Portfolio Builder
        </div>

        {/* Heading */}
        <div className="animate-fade-up" style={{ animationDelay: "80ms" }}>
          <h1 className="text-[clamp(3.5rem,12vw,8rem)] font-black tracking-tighter leading-none gradient-text">
            Angstrom
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto text-wrap-balance leading-relaxed">
            Code tools and a portfolio builder crafted for developers who care
            about the details.
          </p>
        </div>

        {/* CTA — auth-dependent, wrapped in Suspense */}
        <div className="animate-fade-up" style={{ animationDelay: "160ms" }}>
          <Suspense
            fallback={
              <div className="h-12 w-48 rounded-full bg-muted/30 animate-pulse" />
            }
          >
            <HeroCta />
          </Suspense>
        </div>

        {/* Tool feature cards */}
        <div
          className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 animate-fade-up"
          style={{ animationDelay: "240ms" }}
        >
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.path}
                href={tool.path}
                className={`group relative flex items-start gap-4 p-5 border border-border ${tool.border} bg-card/50 backdrop-blur-sm rounded-xl text-left transition-all duration-300 hover:bg-card hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20`}
              >
                {/* Gradient glow on hover */}
                <div
                  className={`absolute inset-0 rounded-xl bg-gradient-to-br ${tool.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                />

                <div
                  className={`flex-shrink-0 mt-0.5 ${tool.iconColor} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon size={22} strokeWidth={1.5} />
                </div>

                <div className="relative min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-foreground">
                      {tool.name}
                    </span>
                    <ArrowRight
                      size={12}
                      className="text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer hint */}
        <p
          className="text-xs text-muted-foreground/50 font-mono animate-fade-in"
          style={{ animationDelay: "400ms" }}
        >
          No credit card. No install. Works in your browser.
        </p>
      </div>
    </div>
  );
}

async function HeroCta() {
  const session = await auth();
  const user = await getUserByEmail(session?.user?.email);

  if (!session?.user?.email) {
    return (
      <MagicButton
        title="Sign in with Google"
        href="/sign-in"
        icon={<FaGoogle className="text-sm" />}
        position="right"
      />
    );
  }

  if (user?.username) {
    return (
      <MagicButton
        title="Your Portfolio"
        href={`/users/${user.username}`}
        icon={<Send size={16} />}
        position="right"
      />
    );
  }

  return null;
}
