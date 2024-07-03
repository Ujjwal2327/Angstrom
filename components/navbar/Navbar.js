import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SignOut from "../auth/SignOut";
import { auth } from "@/auth";
import GoogleSignIn from "../auth/GoogleSignIn";
import { ModeToggle } from "../ModeToggle";
import { headers } from "next/headers";
import TopMenuItemsList from "./TopMenuItemsList";
import BottomMenuItemsList from "./BottomMenuIntemsList";

export default function Navbar() {
  return (
    <div>
      <Menu />
    </div>
  );
}

async function Menu() {
  const headerList = headers();
  const pathname = headerList.get("x-current-path");
  console.log({ pathname });
  const session = await auth();

  return (
    <Sheet>
      <SheetTrigger>Open</SheetTrigger>
      <SheetContent side="left">
        <div className="grid place-items-center">
          <div className="flex justify-center items-center gap-x-3 mb-4">
            <span className="font-bold text-xl">Angstrom</span>
            <ModeToggle />
          </div>

          <TopMenuItemsList />

          <div className="absolute bottom-10 w-5/6 justify-center items-center">
            {session ? (
              <>
                <BottomMenuItemsList />
                <SignOut isFull />
              </>
            ) : (
              <GoogleSignIn isFull />
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
