import { fonts } from "@/data/codeSnapshotConfig";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useStore from "../store";

export default function FontSelect() {
  const { getEffectiveSettings, setEffectiveSettings } = useStore();
  const { fontStyle } = getEffectiveSettings();

  return (
    <div>
      <label className="block mb-2 text-xs font-medium text-muted-foreground">
        Font
      </label>
      <Select
        value={fontStyle}
        onValueChange={(fontStyle) => setEffectiveSettings({ fontStyle })}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Select Font" />
        </SelectTrigger>
        <SelectContent className="max-h-[500px]">
          {Object.entries(fonts).map(([id, font]) => (
            <SelectItem
              key={id}
              value={id}
              style={{
                fontFamily: font.name,
              }}
            >
              {font.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
