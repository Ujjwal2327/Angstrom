import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronDown, ChevronUp } from "lucide-react";

export function MoveItemTooltip({ index, fieldsLength, moveHandler }) {
  return (
    <TooltipProvider>
      {index > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <ChevronUp
              className="cursor-pointer"
              onClick={() => moveHandler(index, "up")}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Move Upward</p>
          </TooltipContent>
        </Tooltip>
      )}
      {index < fieldsLength - 1 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <ChevronDown
              className="cursor-pointer"
              onClick={() => moveHandler(index, "down")}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Move Downward</p>
          </TooltipContent>
        </Tooltip>
      )}
    </TooltipProvider>
  );
}
