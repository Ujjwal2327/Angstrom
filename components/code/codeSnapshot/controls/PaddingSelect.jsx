import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import useStore from "../store";
import { paddings } from "@/data/codeSnapshotConfig";

export default function PaddingSelect() {
  const padding = useStore((state) => state.padding);

  return (
    <div>
      <label className="block mb-2 text-xs font-medium text-neutral-400">
        Padding
      </label>
      <Select
        value={padding}
        onValueChange={(value) => useStore.setState({ padding: value })}
      >
        <SelectTrigger className="w-20">{padding}</SelectTrigger>
        <SelectContent>
          {paddings.map((padding) => (
            <SelectItem key={padding} value={padding}>
              {padding}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
