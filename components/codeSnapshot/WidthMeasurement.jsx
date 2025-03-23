import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function WidthMeasurement({ showWidth, width }) {
  return (
    <div
      className={cn(
        "border-l-2 border-r-2 h-3 flex items-center justify-center mt-2 relative text-xs text-muted-foreground",
        (!showWidth || width === "auto") && "hidden"
      )}
    >
      <Separator />
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2">
        {width} px
      </span>
    </div>
  );
}
