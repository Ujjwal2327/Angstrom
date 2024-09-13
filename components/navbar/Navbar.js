"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
// import { ModeToggle } from "../ModeToggle";
import TopMenuItemsList from "./TopMenuItemsList";
import BottomMenuItemsList from "./BottomMenuIntemsList";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useStore from "@/stores/useStore";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { LogOut, Menu, UserPlus } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";

export default function Navbar({ session }) {
  const router = useRouter();
  const { user, setUser } = useStore();
  useEffect(() => {
    const getUser = async (email) => {
      try {
        const response = await fetch(`/api/user?email=${email}`);
        const data = await response.json();
        if (data.user) setUser(data.user);
        else if (data.error) throw new Error(data.error);
        // else router.push("/register");
      } catch (error) {
        console.log("Error in fetching user:", error.message);
        toast.error(error.message);
      }
    };
    if (session?.user?.email && !user) getUser(session.user.email);
    else if (!session) setUser(null);
  }, [session, router, user, setUser]);
  return (
    <div className="fixed top-3 right-3 z-50">
      <Sheet>
        <SheetTrigger>
          <Menu />
        </SheetTrigger>
        <SheetContent side="left">
          <div className="grid place-items-center">
            <div className="flex justify-center items-center gap-x-3 mb-4">
              <span className="font-bold text-xl">Angstrom</span>
              {/* <ModeToggle /> */}
            </div>

            <TopMenuItemsList />

            <div className="absolute bottom-10 w-5/6 justify-center items-center">
              {session ? (
                <>
                  {user ? (
                    <BottomMenuItemsList />
                  ) : (
                    <SheetClose asChild>
                      <Link href="/register" className="w-full">
                        <Button className="w-full">
                          Register <UserPlus className="ml-2 text-xl" />
                        </Button>
                      </Link>
                    </SheetClose>
                  )}
                  <SheetClose asChild>
                    <Link href="/sign-out" className="w-full">
                      <Button variant="ghost" className="w-full">
                        Sign Out <LogOut className="ml-2 text-xl" />
                      </Button>
                    </Link>
                  </SheetClose>
                </>
              ) : (
                <SheetClose asChild>
                  <Link href="/sign-in" className="w-full">
                    <Button variant="ghost" className="w-full">
                      Sign in with Google
                      <FaGoogle className="ml-2 text-xl" />
                    </Button>
                  </Link>
                </SheetClose>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
