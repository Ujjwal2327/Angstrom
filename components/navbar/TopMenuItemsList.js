"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { menuItems } from "@/constants.js";
import { usePathname } from "next/navigation";
import { SheetClose } from "@/components/ui/sheet";
import { BookOpen, ImagePlus, ListTodo } from "lucide-react";
import Image from "next/image";

const navIcons = {
  "Markdown Editor": (
    <Image
      src="/icons/navbar/Markdown Editor.svg"
      alt="markdown logo"
      width={25}
      height={25}
      className="relative -right-1"
    />
  ),
  Tasks: <ListTodo size={20} />,
  "Code Differ": <BookOpen size={20} />,
  "Code Snapshot": <ImagePlus size={20} />,
};

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
              <span>{navIcons[item.name]}</span>
            </Button>
          </Link>
        </SheetClose>
      ))}
    </>
  );
}
