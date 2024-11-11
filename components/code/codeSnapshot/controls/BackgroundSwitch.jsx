import useStore from "../store";
import { Switch } from "@/components/ui/switch";

export default function BackgroundSwitch() {
  const store = useStore();
  const { showBackground } = store;

  return (
    <div>
      <label className="block mb-2 text-xs font-medium text-neutral-400">
        Background
      </label>
      <Switch
        checked={showBackground}
        onCheckedChange={(checked) =>
          useStore.setState({ showBackground: checked })
        }
        size="sm"
        className="mt-2"
      />
    </div>
  );
}
