import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import { ThemeProvider } from "@/components/themeProvider";
import { Toaster } from "@/components/ui/sonner";
import { HydrationOverlay } from "@builder.io/react-hydration-overlay";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Angstrom",
  description:
    "The ultimate toolkit for coders and engineers. Effortlessly showcase your career profile to recruiters and potential employers.",
  keywords: "coders, engineers, toolbox, programming, development",
  url: "https://angstrom.vercel.app/",
  canonical: "https://angstrom.vercel.app/",
  robots: "index, follow",
  author: "Angstrom Team",
  publisher: "Angstrom Technologies",
  lang: "en",
};

export default async function RootLayout({ children }) {
  return (
    <html lang={metadata.lang}>
      <head>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="robots" content={metadata.robots} />
        <meta name="author" content={metadata.author} />
        <meta name="publisher" content={metadata.publisher} />
        <link rel="canonical" href={metadata.canonical} />
        <title>{metadata.title}</title>
      </head>
      <body className={inter.className}>
        <HydrationOverlay>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <div className="p-10">{children}</div>
          </ThemeProvider>
          <Toaster />
        </HydrationOverlay>
      </body>
    </html>
  );
}
