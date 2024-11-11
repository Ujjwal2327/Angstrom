import useStore from "../store";
import { Switch } from "@/components/ui/switch";

export default function DarkModeSwitch() {
  const { getEffectiveSettings, setEffectiveSettings } = useStore();
  const { darkMode } = getEffectiveSettings();

  return (
    <div>
      <label className="block mb-2 text-xs font-medium text-neutral-400">
        DarkMode
      </label>
      <Switch
        checked={darkMode}
        onCheckedChange={(checked) =>
          setEffectiveSettings({ darkMode: checked })
        }
        size="sm"
        className="mt-2"
      />
    </div>
  );
}
