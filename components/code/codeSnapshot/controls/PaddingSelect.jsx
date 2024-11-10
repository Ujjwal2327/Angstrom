import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import useStore from "../store";

export default function PaddingSelect() {
  const padding = useStore((state) => state.padding);
  const validPaddings = useStore((state) => state.validPaddings);

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
          {validPaddings.map((pad) => (
            <SelectItem key={pad} value={pad}>
              {pad}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
