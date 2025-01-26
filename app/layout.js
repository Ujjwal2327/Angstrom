import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import { ThemeProvider } from "@/providers/themeProvider";
import { Toaster } from "@/components/ui/sonner";
import DynamicHeight from "@/components/ui/DynamicHeight";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Angstrom - Build Your Professional Developer Profile",
  description:
    "Create and share professional developer profiles with Angstrom. Showcase coding skills, projects, and achievements, and access powerful tools like Markdown Editor, Code Differ, and Code Snapshot.",
  icons: { icon: "/favicon.ico" },
  keywords: [
    "Angstrom",
    "developer profile",
    "coding portfolio",
    "career tools",
    "markdown editor",
    "github profile builder",
    "code differ",
    "code snapshot",
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
    <html lang={metadata.lang}>
      <body className={inter.className}>
        <DynamicHeight />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <div className="p-10">{children}</div>
          <Analytics />
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
