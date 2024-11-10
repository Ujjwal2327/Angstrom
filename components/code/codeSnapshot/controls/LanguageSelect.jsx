import { languages } from "@/data/codeSnapshotConfig";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useStore from "../store";
import { WandSparkles } from "lucide-react";
import { useEffect } from "react";
import flourite from "flourite";

export default function LanguageSelect() {
  const language = useStore((state) => state.language);
  const autoDetectLanguage = useStore((state) => state.autoDetectLanguage);
  const store = useStore();

  useEffect(() => {
    if (autoDetectLanguage) useStore.setState({ autoDetectLanguage: false });
  }, []);

  const handleTitleChange = (lang1) => {
    const { extension } = languages[lang1];
    let newTitle;
    const oldTitle = store.title?.split(".")[0];
    if (extension.includes(".")) {
      if (store.title.includes(".")) newTitle = oldTitle + extension;
      else newTitle = "main" + extension;
    } else newTitle = extension;
    useStore.setState({ title: newTitle });
  };

  const handleChange = (lang) => {
    if (lang === "auto-detect") {
      const lang1 = flourite(store.code, {
        noUnknown: true,
      }).language.toLowerCase();

      if (languages[lang1]) {
        if (lang1 !== lang) {
          handleTitleChange(lang1);
          useStore.setState({ language: lang1 });
        }
        useStore.setState({ autoDetectLanguage: true });
      }
    } else {
      handleTitleChange(lang);
      useStore.setState({
        autoDetectLanguage: false,
        language: lang,
        code: languages[lang].codeSnippet,
      });
    }
  };

  return (
    <div>
      <label className="block mb-2 text-xs font-medium text-neutral-400">
        Language
      </label>
      <Select value={language} onValueChange={handleChange}>
        <SelectTrigger className="w-44">
          {autoDetectLanguage && <WandSparkles className="mr-2" size={20} />}
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent className="dark max-h-[500px]">
          <SelectItem value="auto-detect">Auto Detect</SelectItem>
          {Object.entries(languages).map(([lang, value]) => (
            <SelectItem key={lang} value={lang}>
              {value.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
