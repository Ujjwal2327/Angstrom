import useStore from "../store";
import { Switch } from "@/components/ui/switch";

export default function DarkModeSwitch() {
  const store = useStore();
  const { darkMode } = store;

  return (
    <div>
      <label className="block mb-2 text-xs font-medium text-neutral-400">
        DarkMode
      </label>
      <Switch
        checked={darkMode}
        onCheckedChange={(checked) => useStore.setState({ darkMode: checked })}
        size="sm"
        className="mt-2"
      />
    </div>
  );
}
