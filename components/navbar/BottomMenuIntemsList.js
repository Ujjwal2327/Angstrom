"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { menuItems } from "@/constants.js";
import { usePathname } from "next/navigation";
import useStore from "@/stores/useStore";
import { extractFirstLetters } from "@/utils";

export default function BottomMenuItemsList({ session }) {
  const pathname = usePathname();
  const { user } = useStore();

  return (
    <>
      {menuItems.bottom.map((item) => (
        <Link
          key={item.path}
          href={
            item.name === "My Details"
              ? `${item.path}/${user.username}`
              : item.path
          }
          className="w-full"
        >
          <Button
            className={`w-full mb-1.5 ${
              pathname == item.path && "bg-slate-300 hover:bg-slate-300"
            }`}
          >
            {item.name}
            {item.name === "My Details" && (
              <Avatar className="ml-3 size-7 text-foreground">
                <AvatarImage src={user?.pic} />
                <AvatarFallback>{extractFirstLetters(user)}</AvatarFallback>
              </Avatar>
            )}
          </Button>
        </Link>
      ))}
    </>
  );
}
