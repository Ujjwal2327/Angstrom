import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
// import { ModeToggle } from "../ModeToggle";
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
    <div className="fixed top-0 pt-4 pr-4 z-50 flex justify-end items-center gap-x-4 w-full backdrop-blur bg-background/80">
      <Logo />
      <Link href="https://github.com/Ujjwal2327/Angstrom" target="_blank">
        <FaGithub size={20} />
      </Link>
      <Sheet>
        <SheetTrigger aria-label="toggle menu">
          <Menu />
        </SheetTrigger>
        <SheetContent side="left">
          <div className="flex flex-col relative h-full">
            <div className="flex justify-center items-center gap-x-3 mb-4">
              <SheetClose
                asChild
                className="font-bold text-xl flex justify-center"
              >
                <Link href="/">Angstrom</Link>
              </SheetClose>
              {/* <ModeToggle /> */}
            </div>

            <TopMenuItemsList />
            <Suspense fallback={<></>}>
              <BottomMenuItemsList session={session} />
            </Suspense>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
