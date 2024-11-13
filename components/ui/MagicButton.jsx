"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export const MagicButton = ({ title, href, icon, position, className }) => {
  const router = useRouter();

  return (
    <Link
      className={`relative inline-flex h-12 overflow-hidden rounded-lg p-[1px] focus:outline-none cursor-pointer ${className}`}
      href={href}
      aria-label={title}
    >
      {/* border */}
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />

      <span
        className={`inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-background px-7 text-white backdrop-blur-3xl gap-2 ${
          position === "right" ? "flex-row" : "flex-row-reverse"
        }`}
      >
        <span className="text-sm font-medium">{title}</span>
        {icon}
      </span>
    </Link>
  );
};
