import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { paddings } from "@/data/codeSnapshotConfig";
import useStore from "../store";

export default function PaddingSelect() {
  const { getEffectiveSettings, setEffectiveSettings } = useStore();
  const { padding } = getEffectiveSettings();

  const handleChange = (value) => {
    setEffectiveSettings({ padding: value });
  };

  return (
    <div>
      <label className="block mb-2 text-xs font-medium text-neutral-400">
        Padding
      </label>
      <Select value={padding} onValueChange={handleChange}>
        <SelectTrigger className="w-20">{padding}</SelectTrigger>
        <SelectContent>
          {paddings.map((pad) => (
            <SelectItem key={pad} value={pad}>
              {pad}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
