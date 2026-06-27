"use client";

import Link from "next/link";
import { menuItems } from "@/constants.js";
import { usePathname } from "next/navigation";
import { SheetClose } from "@/components/ui/sheet";

export default function TopMenuItemsList() {
  const pathname = usePathname();

  return (
    <nav aria-label="Tools navigation">
      <p className="px-2 pb-2 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground/60">
        Tools
      </p>
      <ul className="space-y-0.5">
        {menuItems.top.map((item) => {
          const isActive = pathname.includes(item.path);
          return (
            <li key={item.name}>
              <SheetClose asChild>
                <Link
                  href={item.path}
                  className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted/60"
                  }`}
                  aria-label={item.name}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span>{item.name}</span>
                  <span
                    className={`flex-shrink-0 transition-colors ${isActive ? "text-primary" : "text-muted-foreground/50"}`}
                  >
                    {item.icon || item.iconSrc}
                  </span>
                </Link>
              </SheetClose>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
