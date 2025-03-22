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
import { RotateCcw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Editor from "@monaco-editor/react";

export default function CodeEditor({
  language = "javascript",
  theme = "vs-dark",
  fontSize = 14,
  isWrappable = true,
  showMinimap = true,
  tabSize = 4,
  editorHeight = "100vh",
  editorWidth = "70%",
  code = "",
  handleExecution = null,
  showLanguageSelector = true,
  executeButtonTitle = "Execute Code",
  executeButtonLoadTitle = "Executing",
  configAtBottom = false,
}) {
  const [editorSettings, setEditorSettings] = useState({
    language,
    theme,
    fontSize,
    isWrappable,
    showMinimap,
    tabSize,
    editorHeight,
    editorWidth,
    code,
  });
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    function updateEditorHeight() {
      setEditorSettings((prev) => ({
        ...prev,
        editorHeight: `calc(${
          editorHeight ? editorHeight : `${window.innerHeight}px`
        } - 7.5rem)`,
      }));
    }
    updateEditorHeight();
    window.addEventListener("resize", updateEditorHeight);

    return () => window.removeEventListener("resize", updateEditorHeight);
  }, []);

  const handleChange = (key, value) => {
    setEditorSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const languages = ["javascript", "python", "java", "cpp"];
  const tabSizes = [2, 4, 6, 8];
  const fontSizes = [10, 12, 14, 16, 18, 20, 22, 24];

  return (
    <div
      className={`flex flex-col gap-2 ${configAtBottom && "flex-col-reverse"}`}
    >
      <div className="flex items-center justify-between flex-wrap">
        <div className="flex items-center gap-x-5">
          {showLanguageSelector && (
            <Select
              defaultValue={editorSettings.language}
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
          )}

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
                    checked={editorSettings.isWrappable}
                    onCheckedChange={(value) =>
                      handleChange("isWrappable", value)
                    }
                  />
                </div>
                <div className="flex items-center justify-between h-10">
                  <label>Minimap:</label>
                  <Switch
                    checked={editorSettings.showMinimap}
                    onCheckedChange={(value) =>
                      handleChange("showMinimap", value)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label>Font Size:</label>
                  <Select
                    defaultValue={editorSettings.fontSize}
                    onValueChange={(value) => handleChange("fontSize", value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={editorSettings.fontSize} />
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
                  <label>Theme:</label>
                  <Select
                    defaultValue={editorSettings.theme}
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
                    defaultValue={editorSettings.tabSize}
                    onValueChange={(value) => handleChange("tabSize", value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={editorSettings.tabSize} />
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

        <div className="flex gap-x-2 items-center">
          <Button
            onClick={() => handleChange("code", code)}
            disabled={isExecuting}
          >
            <RotateCcw variant="icon" className="w-4 h-4" />
          </Button>

          {handleExecution && (
            <Button
              onClick={() => handleExecution(editorSettings.code)}
              disabled={isExecuting}
            >
              {isExecuting ? executeButtonLoadTitle : executeButtonTitle}
            </Button>
          )}
        </div>
      </div>

      <div className="-mb-2 flex gap-x-5 rounded-lg overflow-hidden">
        {/* <MonacoEditor */}
        <Editor
          theme={editorSettings.theme}
          language={editorSettings.language}
          value={editorSettings.code}
          onChange={(newCode) => handleChange("code", newCode)}
          options={{
            fontSize: editorSettings.fontSize,
            wordWrap: editorSettings.isWrappable ? "on" : "off",
            minimap: { enabled: editorSettings.showMinimap },
            scrollBeyondLastLine: false,
            tabSize: editorSettings.tabSize,
          }}
          width={editorSettings.editorWidth}
          height={editorSettings.editorHeight}
        />
      </div>
    </div>
  );
}
