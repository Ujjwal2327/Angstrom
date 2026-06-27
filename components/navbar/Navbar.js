import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import TopMenuItemsList from "./TopMenuItemsList";
import BottomMenuItemsList from "./BottomMenuItemsList";
import { Menu } from "lucide-react";
import { auth } from "@/auth";
import { Suspense } from "react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import Logo from "../Logo";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-14 glass border-b border-border/50">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left — logo + wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2.5 flex-shrink-0 group"
          aria-label="Angstrom home"
        >
          <Logo />
          <span className="font-mono font-bold text-sm tracking-wide text-foreground group-hover:text-primary transition-colors duration-200">
            Angstrom
          </span>
        </Link>

        {/* Right — GitHub link + hamburger */}
        <div className="flex items-center gap-3">
          <Link
            href="https://github.com/Ujjwal2327/Angstrom"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            aria-label="View source on GitHub"
          >
            <FaGithub size={18} />
          </Link>

          <Sheet>
            <SheetTrigger
              className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground transition-colors duration-200"
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </SheetTrigger>

            <SheetContent side="left" className="w-72 p-0 border-border/60">
              <div className="flex flex-col h-full">
                {/* Sheet header */}
                <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border/60">
                  <SheetClose asChild>
                    <Link
                      href="/"
                      className="flex items-center gap-2.5 group"
                      aria-label="Angstrom home"
                    >
                      <Logo />
                      <span className="font-mono font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                        Angstrom
                      </span>
                    </Link>
                  </SheetClose>
                </div>

                {/* Navigation items */}
                <div className="flex-1 overflow-y-auto py-3 px-3">
                  <TopMenuItemsList />
                </div>

                {/* Bottom: auth actions */}
                <div className="border-t border-border/60 px-3 py-3">
                  <Suspense
                    fallback={
                      <div className="h-10 rounded-md bg-muted/30 animate-pulse" />
                    }
                  >
                    <BottomMenuItemsList session={session} />
                  </Suspense>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
