import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import { ThemeProvider } from "@/components/themeProvider";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/auth";
import { HydrationOverlay } from "@builder.io/react-hydration-overlay";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Angstrom",
  description: "The app for Engineers",
};

export default async function RootLayout({ children }) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={inter.className}>
        <HydrationOverlay>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar session={session} />
            <div className="px-10">{children}</div>{" "}
          </ThemeProvider>
          <Toaster />
        </HydrationOverlay>
      </body>
    </html>
  );
}
