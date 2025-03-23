"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { menuItems } from "@/constants.js";
import { usePathname } from "next/navigation";
import { SheetClose } from "@/components/ui/sheet";

export default function TopMenuItemsList() {
  const pathname = usePathname();

  return (
    <>
      {menuItems.top.map((item, index) => (
        <SheetClose asChild key={item.name}>
          <Link href={item.path} className="w-full">
            <Button
              className={`w-full mb-1.5 justify-between gap-x-2 px-8 ${
                pathname.includes(item.path) &&
                "bg-slate-300 hover:bg-slate-300"
              }`}
              aria-label={item.name}
            >
              <span>{item.name}</span>
              <span>{item.icon || item.iconSrc}</span>
            </Button>
          </Link>
        </SheetClose>
      ))}
    </>
  );
}
