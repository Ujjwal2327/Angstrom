import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { menuItems } from "@/constants";
import { buttonVariants } from "../ui/button";

export default function HeroMenu() {
  return (
    <TooltipProvider>
      <div className="flex justify-center items-center gap-6">
        {menuItems.top.map((item) => (
          <Tooltip key={item.name}>
            <TooltipTrigger asChild>
              <Link
                href={item.path}
                className={buttonVariants({ variant: "secondary" })}
              >
                {item.icon || item.iconSrcLight}
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{item.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
