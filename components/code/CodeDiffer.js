"use client";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Settings } from "lucide-react";
import { DiffEditor } from "@monaco-editor/react";

export default function CodeDiffer({
  language = "javascript",
  theme = "vs-dark",
  fontSize = 14,
  fontFamily = "Source Code Pro, monospace",
  isWrappable = true,
  tabSize = 4,
  editorHeight = "100vh",
  editorWidth = "100%",
}) {
  const languages = ["javascript", "python", "java", "cpp"];
  const tabSizes = [2, 4, 6, 8];
  const fontSizes = [10, 12, 14, 16, 18, 20, 22, 24];
  const fontFamilies = [
    "Arial Black, sans-serif",
    "Comic Sans MS, cursive, sans-serif",
    "Courier New, monospace",
    "Georgia, serif, sans-serif",
    "Source Code Pro, monospace",
    "system-ui, sans-serif",
  ];

  const [differSettings, setDifferSettings] = useState({
    language,
    theme,
    fontSize,
    fontFamily,
    isWrappable,
    tabSize,
    editorHeight,
    editorWidth,
  });

  useEffect(() => {
    const storedSettings = JSON.parse(localStorage.getItem("differSettings"));
    if (storedSettings) {
      setDifferSettings((prev) => ({
        ...prev,
        ...storedSettings,
      }));
    }
    function updateEditorHeight() {
      setDifferSettings((prev) => ({
        ...prev,
        editorHeight: `calc(${window.innerHeight}px - 7.5rem)`,
      }));
    }
    updateEditorHeight();
    window.addEventListener("resize", updateEditorHeight);

    return () => window.removeEventListener("resize", updateEditorHeight);
  }, []);

  const handleChange = (key, value) => {
    setDifferSettings((prev) => {
      const updatedSettings = {
        ...prev,
        [key]: value,
      };
      localStorage.setItem("differSettings", JSON.stringify(updatedSettings));
      return updatedSettings;
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between flex-wrap">
        <div className="flex items-center gap-x-5">
          <Select
            value={differSettings.language}
            onValueChange={(value) => handleChange("language", value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog>
            <DialogTrigger asChild>
              <Settings size={20} className="cursor-pointer" />
            </DialogTrigger>
            <DialogContent>
              <h3 className="font-bold">Editor Settings</h3>
              <div className="flex flex-col gap-y-2">
                <div className="flex items-center justify-between h-10">
                  <label>Wrappable:</label>
                  <Switch
                    checked={differSettings.isWrappable}
                    onCheckedChange={(value) =>
                      handleChange("isWrappable", value)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label>Font Size:</label>
                  <Select
                    value={differSettings.fontSize}
                    onValueChange={(value) => handleChange("fontSize", value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={differSettings.fontSize} />
                    </SelectTrigger>
                    <SelectContent>
                      {fontSizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <label>Font Family:</label>
                  <Select
                    value={differSettings.fontFamily}
                    onValueChange={(value) => handleChange("fontFamily", value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={differSettings.fontFamily} />
                    </SelectTrigger>
                    <SelectContent>
                      {fontFamilies.map((family) => (
                        <SelectItem
                          key={family}
                          value={family}
                          style={{ fontFamily: family }}
                        >
                          {family.split(",")[0].trim()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <label>Theme:</label>
                  <Select
                    value={differSettings.theme}
                    onValueChange={(value) => handleChange("theme", value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vs-dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="hc-black">High Contrast</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <label>Tab Size:</label>
                  <Select
                    value={differSettings.tabSize}
                    onValueChange={(value) => handleChange("tabSize", value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={differSettings.tabSize} />
                    </SelectTrigger>
                    <SelectContent>
                      {tabSizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="-mb-2 flex gap-x-5">
        {/* <MonacoEditor */}
        <DiffEditor
          theme={differSettings.theme}
          language={differSettings.language}
          options={{
            fontSize: differSettings.fontSize,
            wordWrap: differSettings.isWrappable ? "on" : "off",
            tabSize: differSettings.tabSize,
            scrollBeyondLastLine: false,
            originalEditable: true,
            fontFamily: differSettings.fontFamily,
          }}
          width={differSettings.editorWidth}
          height={differSettings.editorHeight}
        />
      </div>
    </div>
  );
}
