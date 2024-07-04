"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "../ModeToggle";
import TopMenuItemsList from "./TopMenuItemsList";
import BottomMenuItemsList from "./BottomMenuIntemsList";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useStore from "@/stores/useStore";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { FaGoogle } from "react-icons/fa";

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
        else router.push("/register");
      } catch (error) {
        console.log("Error in fetching user:", error.message);
        toast.error(error.message);
      }
    };
    if (session?.user?.email && !user) getUser(session.user.email);
    else if (!session) setUser(null);
    console.log("in navbar: ", { username: user?.username });
  }, [session, router, user, setUser]);
  return (
    <div>
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
              {user ? (
                <>
                  <BottomMenuItemsList />
                  <Button
                    onClick={() => {
                      router.push("sign-out");
                    }}
                    variant="outline"
                    type="submit"
                    className="w-full"
                  >
                    Sign Out <LogOut className="ml-2 text-xl" />
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => {
                    router.push("sign-in");
                  }}
                  variant="outline"
                  type="submit"
                  className="w-full"
                >
                  Signin with Google
                  <FaGoogle className="ml-2 text-xl" />
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
