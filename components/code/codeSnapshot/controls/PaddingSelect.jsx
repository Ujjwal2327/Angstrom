import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import useStore from "../store";
import { paddings } from "@/data/codeSnapshotConfig";

export default function PaddingSelect() {
  const store = useStore();
  const { padding } = store;

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
