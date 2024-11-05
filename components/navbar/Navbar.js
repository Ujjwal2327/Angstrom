import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
// import { ModeToggle } from "../ModeToggle";
import TopMenuItemsList from "./TopMenuItemsList";
import BottomMenuItemsList from "./BottomMenuIntemsList";
import { Menu } from "lucide-react";
import { auth } from "@/auth";
import { Suspense } from "react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export default async function Navbar() {
  const session = await auth();
  return (
    <div className="fixed top-3 right-3 z-50 flex justify-center items-center gap-x-4">
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
