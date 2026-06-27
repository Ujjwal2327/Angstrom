import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import { ThemeProvider } from "@/providers/themeProvider";
import { Toaster } from "@/components/ui/sonner";
import DynamicHeight from "@/components/ui/DynamicHeight";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Angstrom — Developer Toolbox & Portfolio",
  description:
    "Code snapshots, diff viewer, JSON slicer, markdown editor, and a portfolio builder — all in one place for developers.",
  icons: { icon: "/favicon.ico" },
  keywords: [
    "Angstrom",
    "developer portfolio",
    "code snapshot",
    "code differ",
    "JSON slicer",
    "markdown editor",
    "github profile builder",
    "ray.so alternative",
  ],
  url: "https://angstrom.vercel.app/",
  canonical: "https://angstrom.vercel.app/",
  robots: "index, follow",
  author: "Ujjwal",
  publisher: "Ujjwal",
  lang: "en",
};

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning — next-themes sets className="dark" on <html> client-side.
    // Without this attribute React logs a hydration mismatch warning in the console.
    // Official fix: https://nextjs.org/docs/messages/react-hydration-error
    <html lang={metadata.lang} suppressHydrationWarning>
      <body className={inter.className}>
        <DynamicHeight />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {/* pt-14 compensates for the fixed 56px (h-14) navbar */}
          <div className="pt-14 p-10">{children}</div>
          <Analytics />
        </ThemeProvider>
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}
