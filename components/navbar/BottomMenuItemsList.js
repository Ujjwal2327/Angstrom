"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { default_user_pic, menuItems } from "@/constants.js";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import useStore from "@/stores/useStore";
import { toast } from "sonner";
import { extractFirstLetters, resolveUrl } from "@/utils";
import { SheetClose } from "@/components/ui/sheet";
import { LogOut, UserCircle } from "lucide-react";
import { FaGoogle } from "react-icons/fa";

export default function BottomMenuItemsList({ session }) {
  const pathname = usePathname();
  const { user, setUser } = useStore();

  useEffect(() => {
    const getUser = async (email) => {
      try {
        const response = await fetch(`/api/user?email=${email}`);
        const data = await response.json();
        if (data.user) setUser(data.user);
        else if (data.error) throw new Error(data.error);
      } catch (error) {
        toast.error(error.message);
      }
    };
    if (session?.user?.email && !user) getUser(session.user.email);
    else if (!session) setUser(null);
  }, [session, user, setUser]);

  const fullname =
    [user?.firstname, user?.lastname].filter(Boolean).join(" ").trim() ||
    user?.username;

  if (!session?.user?.email) {
    return (
      <SheetClose asChild>
        <Link
          href="/sign-in"
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted/60 transition-all duration-150"
          aria-label="Sign in with Google"
        >
          <FaGoogle size={15} className="text-muted-foreground" />
          Sign in with Google
        </Link>
      </SheetClose>
    );
  }

  return (
    <div className="space-y-0.5">
      {/* Profile link (only if registered) */}
      {user?.username && (
        <>
          <p className="px-2 pb-1 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground/60">
            Account
          </p>
          {menuItems.bottom.map((item) => {
            const href =
              item.name === "My Profile"
                ? `${item.path}/${user.username}`
                : item.path;
            const isActive =
              item.name === "My Profile"
                ? pathname === href
                : pathname.includes(item.path);

            return (
              <SheetClose asChild key={item.path}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted/60"
                  }`}
                  aria-label={item.name}
                >
                  <Avatar className="size-5">
                    <AvatarImage src={resolveUrl(user.pic, default_user_pic)} />
                    <AvatarFallback className="text-[10px]">
                      {extractFirstLetters(fullname || "?")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{fullname || user.username}</span>
                </Link>
              </SheetClose>
            );
          })}
        </>
      )}

      {/* Sign out */}
      <SheetClose asChild>
        <Link
          href="/sign-out"
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all duration-150"
          aria-label="Sign out"
        >
          <LogOut size={15} />
          Sign Out
        </Link>
      </SheetClose>
    </div>
  );
}
