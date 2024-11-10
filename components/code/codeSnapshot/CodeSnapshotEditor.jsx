import { cn } from "@/lib/utils";
import { fonts } from "@/data/codeSnapshotConfig";
import useStore from "./store";
import hljs from "highlight.js";
import Editor from "react-simple-code-editor";

export default function CodeSnapshotEditor() {
  const store = useStore();

  return (
    <div
      className={cn(
        " border-2 rounded-xl shadow-2xl min-w-80",
        store.darkMode
          ? "bg-black/80 border-gray-600/40"
          : "bg-white/90 border-gray-200/20"
      )}
    >
      <header className="grid grid-cols-6 items-center px-4 py-3">
        <div className="flex gap-1.5">
          <div className="rounded-full h-3 w-3 bg-red-500" />
          <div className="rounded-full h-3 w-3 bg-yellow-500" />
          <div className="rounded-full h-3 w-3 bg-green-500" />
        </div>
        <div className="col-span-4 flex justify-center">
          <input
            type="text"
            value={`${store.title}`}
            onChange={(e) => useStore.setState({ title: e.target.value })}
            spellCheck={false}
            maxLength={12}
            className={cn(
              "bg-transparent text-center text-sm font-medium focus:outline-none max-w-36 truncate",
              store.darkMode ? "text-gray-300" : "text-gray-600"
            )}
          />
        </div>
      </header>
      <div
        className={cn(
          "px-4 pb-4",
          store.darkMode
            ? "brightness-110"
            : "text-gray-800 brightness-50 saturate-200 contrast-200"
        )}
      >
        <Editor
          value={store.code}
          onValueChange={(code) => useStore.setState({ code })}
          highlight={(code) =>
            hljs.highlight(code, {
              language: store.language || "plaintext",
            }).value
          }
          style={{
            fontFamily: fonts[store.fontStyle].name,
            fontSize: 18,
          }}
          textareaClassName="focus:outline-none"
        />
      </div>
    </div>
  );
}
