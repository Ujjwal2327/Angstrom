import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import { ThemeProvider } from "@/components/themeProvider";
import { Toaster } from "@/components/ui/sonner";
import DynamicHeight from "@/components/ui/DynamicHeight";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Angstrom",
  description:
    "The ultimate toolkit for coders and engineers. Effortlessly showcase your career profile to recruiters and potential employers.",
  icons: { icon: "/favicon.ico" },
  keywords: "coders, engineers, toolbox, programming, development",
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
