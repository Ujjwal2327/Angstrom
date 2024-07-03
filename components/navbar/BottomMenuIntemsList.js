"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { menuItems } from "@/constants.js";
import { usePathname } from "next/navigation";

export default function BottomMenuItemsList() {
  const pathname = usePathname();

  return (
    <>
      {menuItems.bottom.map((item) => (
        <Link key={item.path} href={item.path} className="w-full">
          <Button
            className={`w-full mb-1.5 ${
              pathname == item.path && "bg-slate-300 hover:bg-slate-300"
            }`}
          >
            {item.name}
          </Button>
        </Link>
      ))}
    </>
  );
}
