import { cn } from "@/lib/utils";
import { fonts } from "@/data/codeSnapshotConfig";
import useStore from "./store";
import hljs from "highlight.js";
import Editor from "react-simple-code-editor";

export default function CodeSnapshotEditor({ scale }) {
  const { getEffectiveSettings, setEffectiveSettings } = useStore();
  const { code, darkMode, fontStyle, language, title, fontSize } =
    getEffectiveSettings();

  const handleTitleChange = (e) => {
    setEffectiveSettings({ title: e.target.value });
  };

  const handleCodeChange = (newCode) => {
    setEffectiveSettings({ code: newCode });
  };

  return (
    <div
      className={cn(
        "border-2 rounded-xl shadow-2xl min-w-80",
        darkMode
          ? "bg-black/80 border-gray-600/40"
          : "bg-white/90 border-gray-200/20"
      )}
    >
      <header className="flex items-center justify-center px-4 py-3 relative w-full">
        <div className="flex gap-1.5 absolute left-4">
          <div className="rounded-full h-3 w-3 bg-red-500" />
          <div className="rounded-full h-3 w-3 bg-yellow-500" />
          <div className="rounded-full h-3 w-3 bg-green-500" />
        </div>
        <div className="flex justify-center w-full">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            spellCheck={false}
            className={cn(
              "bg-transparent text-center font-medium focus:outline-none truncate w-[calc(100%-110px)]",
              darkMode ? "text-gray-300" : "text-gray-600",
              `text-[calc(${14 * scale}px)] leading-[calc(${20 * scale}px)]`
            )}
          />
        </div>
      </header>

      <div
        className={cn(
          "px-4 pb-4",
          darkMode
            ? "brightness-110"
            : "text-gray-800 brightness-50 saturate-200 contrast-200"
        )}
      >
        <Editor
          value={code}
          onValueChange={handleCodeChange}
          highlight={(code) =>
            hljs.highlight(code, {
              language: language || "plaintext",
            }).value
          }
          style={{
            fontFamily: fonts[fontStyle]?.name,
            fontSize: fontSize || 18,
          }}
          textareaClassName="focus:outline-none"
        />
      </div>
    </div>
  );
}
