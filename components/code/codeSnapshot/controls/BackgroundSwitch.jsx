import useStore from "../store";
import { Switch } from "@/components/ui/switch";

export default function BackgroundSwitch() {
  const showBg = useStore((state) => state.showBackground);

  return (
    <div>
      <label className="block mb-2 text-xs font-medium text-neutral-400">
        Background
      </label>
      <Switch
        checked={showBg}
        onCheckedChange={(checked) =>
          useStore.setState({ showBackground: checked })
        }
        size="sm"
        className="mt-2"
      />
    </div>
  );
}
