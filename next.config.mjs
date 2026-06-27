import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Turbopack root ───────────────────────────────────────────────────────
  // Next.js 16 + Turbopack walks up the directory tree looking for a
  // workspace root. If it finds a package-lock.json in a parent directory
  // (e.g. C:\Users\<name>\package-lock.json) it uses that directory as the
  // root instead of the project directory. This breaks module resolution for
  // any route in a subdirectory — including app/api/user/route.js, which
  // is why that route was returning 404.
  //
  // Setting turbopack.root to the project directory explicitly fixes this.
  // __dirname here is the directory containing next.config.mjs (the project root).
  turbopack: {
    root: __dirname,
  },

  // ── Images ────────────────────────────────────────────────────────────────
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "api.microlink.io" },
      { protocol: "https", hostname: "opengraph.githubassets.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "*.postimages.org" },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // ── Experimental ──────────────────────────────────────────────────────────
  experimental: {
    // Tree-shake large icon/component libraries so only used exports are bundled.
    optimizePackageImports: [
      "lucide-react",
      "react-icons",
      "@radix-ui/react-avatar",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
      "highlight.js",
    ],
  },

  // ── Server externals ──────────────────────────────────────────────────────
  serverExternalPackages: ["@prisma/client", "prisma"],

  // NOTE: staleTimes was removed — it is not a valid key in Next.js 16.2.x
  // and was causing an "Unrecognized key(s)" warning on every startup.
  // reactCompiler: true,   ← uncomment after local validation
};

export default nextConfig;
