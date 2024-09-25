import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import { ThemeProvider } from "@/components/themeProvider";
import { Toaster } from "@/components/ui/sonner";
import { HydrationOverlay } from "@builder.io/react-hydration-overlay";
import Script from "next/script";  // Import Script for GTM

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Angstrom",
  description:
    "The ultimate toolkit for coders and engineers. Effortlessly showcase your career profile to recruiters and potential employers.",
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
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-WGVW8TMP');`}
        </Script>
        {/* End Google Tag Manager */}
      </head>
      <body className={inter.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WGVW8TMP"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        
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
