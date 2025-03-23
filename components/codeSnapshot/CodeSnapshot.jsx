"use client";
import useStore from "./store.js";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils.js";
import { fonts, languages, paddings, themes } from "@/data/codeSnapshotConfig";
import ExportOptions from "./controls/ExportOptions.jsx";
import ThemeSelect from "./controls/ThemeSelect.jsx";
import LanguageSelect from "./controls/LanguageSelect.jsx";
import FontSelect from "./controls/FontSelect.jsx";
import BackgroundSwitch from "./controls/BackgroundSwitch.jsx";
import DarkModeSwitch from "./controls/DarkModeSwitch.jsx";
import { Resizable } from "re-resizable";
import { Button } from "@/components/ui/button";
import WidthMeasurement from "./WidthMeasurement.jsx";
import CodeSnapshotEditor from "./CodeSnapshotEditor";
import { RotateCcw } from "lucide-react";
import PaddingSelect from "./controls/PaddingSelect.jsx";

export default function CodeSnapshot() {
  const [width, setWidth] = useState("auto");
  const [showWidth, setShowWidth] = useState(false);
  const [scale, setScale] = useState(1);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth - 80);

  const { getEffectiveSettings, setEffectiveSettings } = useStore();
  const { theme, padding, showBackground } = getEffectiveSettings();

  const editorRef = useRef(null);
  const containerRef = useRef(null);

  // set data on initial render or from sharable link
  useEffect(() => {
    const query = new URLSearchParams(location.search);

    if (query.size === 0) {
      setEffectiveSettings({
        autoDetectLanguage: false,
        isSharable: false,
      });
      return;
    }

    const getDecodedValue = (param) => {
      try {
        return decodeURIComponent(query.get(param) || "");
      } catch (e) {
        console.error(`Error decoding ${param}:`, e);
        return "";
      }
    };

    const getDecodedCode = () => {
      const codeParam = query.get("code") || "";
      try {
        return atob(codeParam);
      } catch (e) {
        console.error("Error decoding base64 code:", e);
        return ""; // Default to an empty string if decoding fails
      }
    };

    const params = {
      code: getDecodedCode(),
      title: getDecodedValue("title"),
      theme: themes.hasOwnProperty(getDecodedValue("theme"))
        ? getDecodedValue("theme")
        : "bitmap",
      darkMode: query.get("darkMode") !== "false",
      showBackground: query.get("showBackground") !== "false",
      language: languages.hasOwnProperty(getDecodedValue("language"))
        ? getDecodedValue("language")
        : "c++",
      fontSize: parseInt(query.get("fontSize"), 10) || 18,
      fontStyle: fonts.hasOwnProperty(getDecodedValue("fontStyle"))
        ? getDecodedValue("fontStyle")
        : "jetBrainsMono",
      padding: paddings.includes(parseInt(query.get("padding"), 10))
        ? parseInt(query.get("padding"), 10)
        : 48,
    };

    setEffectiveSettings({
      ...params,
      autoDetectLanguage: false,
      isSharable: true,
    });
  }, [setEffectiveSettings]);

  // get viewport_width - padding(40+40)
  useEffect(() => {
    const handleResize = () => {
      setInnerWidth(window.innerWidth - 80);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // set scale of snapshot
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const newScale = innerWidth / containerWidth;
      setScale(newScale < 1 ? newScale : 1);
    }
  }, [padding, innerWidth]);

  return (
    <div className="relative flex justify-center overflow-y-auto overflow-x-hidden h-screen -my-10">
      {/* font colour and font style meta links */}
      <link
        rel="stylesheet"
        href={themes[theme].color}
        crossOrigin="anonymous"
      />
      {Object.entries(fonts).map(([key, value]) => (
        <link
          key={key}
          rel="stylesheet"
          href={value.src}
          crossOrigin="anonymous"
        />
      ))}

      {/* without manually adding like this, the theme is not being rendered in ui */}
      <div className="hidden">
        <div className="bg-gradient-to-br from-gray-200 to-gray-500 h-32 w-32 rounded-lg" />
        <div className="bg-gradient-to-br from-cyan-100 via-blue-200 to-indigo-300 h-32 w-32 rounded-lg" />
        <div className="bg-gradient-to-tr from-gray-700 via-gray-800 to-gray-900 h-32 w-32 rounded-lg" />
        <div className="bg-gradient-to-br from-red-500 via-pink-600 to-purple-700 h-32 w-32 rounded-lg" />
        <div className="bg-gradient-to-tl from-orange-600 via-red-500 to-pink-400 h-32 w-32 rounded-lg" />
        <div className="bg-gradient-to-br from-pink-400 to-pink-600 h-32 w-32 rounded-lg" />
        <div className="bg-gradient-to-br from-teal-300 to-lime-400 h-32 w-32 rounded-lg" />
        <div className="bg-gradient-to-br from-gray-700 via-gray-900 to-black h-32 w-32 rounded-lg" />
        <div className="bg-gradient-to-tr from-yellow-300 via-amber-400 to-orange-500 h-32 w-32 rounded-lg" />
        <div className="bg-gradient-to-br from-fuchsia-500 via-red-600 to-orange-400 h-32 w-32 rounded-lg" />
        <div className="bg-gradient-to-br from-rose-100 to-teal-100 h-32 w-32 rounded-lg" />
        <div className="bg-gradient-to-br from-cyan-200 via-teal-300 to-blue-400 h-32 w-32 rounded-lg" />
        <div className="bg-gradient-to-br from-lime-300 to-green-400 h-32 w-32 rounded-lg" />
        <div className="bg-gradient-to-br from-gray-800 to-blue-900 h-32 w-32 rounded-lg" />
        <div className="bg-gradient-to-br from-cyan-500 to-purple-700 h-32 w-32 rounded-lg" />
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black h-32 w-32 rounded-lg" />
        <div className="bg-gradient-to-br from-rose-200 via-purple-200 to-teal-300 h-32 w-32 rounded-lg" />
        <div className="bg-gradient-to-br from-rose-400 to-orange-300 h-32 w-32 rounded-lg" />
        <div className="bg-gradient-to-br from-yellow-400 to-orange-300 h-32 w-32 rounded-lg" />
        <div className="bg-gradient-to-br from-sky-500 to-indigo-600 h-32 w-32 rounded-lg" />
        <div className="bg-gradient-to-br from-red-400 to-orange-500 h-32 w-32 rounded-lg" />
        <div className="bg-gradient-to-t from-gray-700 via-gray-500 to-gray-900 h-32 w-32 rounded-lg" />
        <div className="bg-gradient-to-br from-red-600 via-orange-600 to-yellow-500 h-32 w-32 rounded-lg" />
      </div>

      {/* controls */}
      <div className="flex flex-wrap gap-x-6 gap-y-4 fixed top-10 left-10 right-10 z-10 backdrop-blur bg-background/80">
        <div className="flex gap-x-6 overflow-x-auto p-2 mx-auto">
          <ThemeSelect />
          <DarkModeSwitch />
          <BackgroundSwitch />
          <PaddingSelect />
          <LanguageSelect />
          <FontSelect />
        </div>
        <div className="place-self-center">
          <ExportOptions targetRef={editorRef} />
        </div>
      </div>

      <div
        className="transition-transform mt-56 sm:mt-40"
        ref={containerRef}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          height: `${scale}%`,
        }}
      >
        <Resizable
          enable={{ left: true, right: true }}
          minWidth={padding * 2 + 320}
          maxWidth={window?.innerWidth - 80}
          size={{ width }}
          onResize={(e, dir, ref) => setWidth(ref.offsetWidth)}
          onResizeStart={() => setShowWidth(true)}
          onResizeStop={() => setShowWidth(false)}
          className="mx-auto"
        >
          <div className="relative">
            <div className="h-1.5 w-1.5 bg-white rounded-full z-0 absolute top-1/2 -translate-y-1/2 -left-[3px]" />
            <div className="h-1.5 w-1.5 bg-white rounded-full z-0 absolute top-1/2 -translate-y-1/2 -right-[3px]" />
            <div
              className={cn(
                "transition-all ease-out border-l border-r mx-auto",
                showBackground
                  ? themes[theme]?.background
                  : "ring ring-neutral-900",
                padding === 0 && "rounded-xl"
              )}
              style={{ padding }}
              ref={editorRef}
            >
              <CodeSnapshotEditor scale={scale} />
            </div>
          </div>

          <WidthMeasurement showWidth={showWidth} width={width} />
          <Button
            size="sm"
            onClick={() => setWidth("auto")}
            variant="ghost"
            className={cn(
              "flex gap-x-2 transition-opacity w-fit mx-auto text-xs text-muted-foreground",
              (showWidth || width === "auto") && "hidden"
            )}
          >
            <RotateCcw size={15} />
            Reset width
          </Button>
        </Resizable>
      </div>
    </div>
  );
}
