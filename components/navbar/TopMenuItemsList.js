"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { menuItems } from "@/constants.js";
import { usePathname } from "next/navigation";
import { SheetClose } from "@/components/ui/sheet";
import { House } from "lucide-react";
import Image from "next/image";

const navIcons = {
  Home: <House size={20} />,
  "Markdown Editor": (
    <Image
      src="/icons/navbar/Markdown Editor.svg"
      alt="markdown logo"
      width={25}
      height={25}
    />
  ),
};

export default function TopMenuItemsList() {
  const pathname = usePathname();

  return (
    <>
      {menuItems.top.map((item, index) => (
        <SheetClose asChild key={item.name}>
          <Link href={item.path} className="w-full">
            <Button
              className={`w-full mb-1.5 flex gap-x-2 ${
                pathname == item.path && "bg-slate-300 hover:bg-slate-300"
              }`}
              aria-label={item.name}
            >
              <span>{item.name}</span>
              <span>{navIcons[item.name]}</span>
            </Button>
          </Link>
        </SheetClose>
      ))}
    </>
  );
}
