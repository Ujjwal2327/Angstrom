"use client";
import useStore from "./store.js";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils.js";
import { fonts, themes } from "@/data/codeSnapshotConfig";
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

  const theme = useStore((state) => state.theme);
  const padding = useStore((state) => state.padding);
  const showBackground = useStore((state) => state.showBackground);
  const editorRef = useRef(null);
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth - 80);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.size === 0) return;
    const state = Object.fromEntries(queryParams);

    useStore.setState({
      ...state,
      code: state.code ? atob(state.code) : "",
      autoDetectLanguage: state.autoDetectLanguage === "true",
      darkMode: state.darkMode === "true",
      padding: Number(state.padding || 64),
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setInnerWidth(window.innerWidth - 80);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      console.log(containerRef.current.offsetWidth);
      const newScale = innerWidth / containerWidth;
      setScale(newScale < 1 ? newScale : 1);
    }
  }, [padding, innerWidth]);

  return (
    <div className="relative flex justify-center overflow-y-auto overflow-x-hidden h-screen -my-10">
      {/* themes and fonts meta links */}
      {Object.entries(themes).map(([key, value]) => (
        <link
          key={key}
          rel="stylesheet"
          href={value.theme}
          crossOrigin="anonymous"
        />
      ))}
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
        <div className="bg-gradient-to-br from-gray-200 to-gray-500 h-32 w-32 rounded-lg"></div>
        <div className="bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 h-32 w-32 rounded-lg"></div>
        <div className="bg-gradient-to-br from-blue-400 to-emerald-400 h-32 w-32 rounded-lg"></div>
        <div className="bg-gradient-to-br from-red-500 via-pink-600 to-purple-700 h-32 w-32 rounded-lg"></div>
        <div className="bg-gradient-to-br from-pink-400 to-pink-600 h-32 w-32 rounded-lg"></div>
        <div className="bg-gradient-to-br from-gray-700 via-gray-900 to-black h-32 w-32 rounded-lg"></div>
        <div className="bg-gradient-to-br from-orange-500 to-yellow-300 h-32 w-32 rounded-lg"></div>
        <div className="bg-gradient-to-br from-fuchsia-500 via-red-600 to-orange-400 h-32 w-32 rounded-lg"></div>
        <div className="bg-gradient-to-br from-rose-100 to-teal-100 h-32 w-32 rounded-lg"></div>
        <div className="bg-gradient-to-br from-gray-800 to-blue-900 h-32 w-32 rounded-lg"></div>
        <div className="bg-gradient-to-br from-green-300 via-blue-500 to-purple-600 h-32 w-32 rounded-lg"></div>
        <div className="bg-gradient-to-br from-rose-400 to-orange-300 h-32 w-32 rounded-lg"></div>
        <div className="bg-gradient-to-br from-yellow-400 to-orange-300 h-32 w-32 rounded-lg"></div>
        <div className="bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500 h-32 w-32 rounded-lg"></div>
        <div className="bg-gradient-to-br from-red-400 to-orange-500 h-32 w-32 rounded-lg"></div>
      </div>

      {/* controls */}
      <div className="flex flex-wrap gap-x-6 gap-y-4 fixed top-10 left-10 right-10 z-10 backdrop-blur bg-background/80">
        <div className="flex gap-x-6 overflow-x-auto p-2 mx-auto">
          <ThemeSelect />
          <DarkModeSwitch />
          <BackgroundSwitch />
          <PaddingSelect />
          {/* {validPaddings?.length > 1 && <PaddingSelect />} */}
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
              <CodeSnapshotEditor />
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
