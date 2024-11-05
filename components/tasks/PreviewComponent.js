"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Maximize, Minimize } from "lucide-react";

export default function PreviewComponent({ taskName }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const Preview = dynamic(() =>
    import(`@/components/tasks/${taskName}/index.js`).then((mod) => mod.default)
  );

  const toggleFullScreen = () => setIsFullScreen(!isFullScreen);

  // Listen for "Esc" key to exit full screen
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape" && isFullScreen) setIsFullScreen(false);
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isFullScreen]);

  return (
    <div
      className={`relative w-full ${
        isFullScreen && "full-screen bg-background p-5"
      }`}
    >
      <button
        onClick={toggleFullScreen}
        className={`absolute ${
          isFullScreen ? "top-5 right-5" : "top-0 right-0"
        }`}
      >
        {isFullScreen ? <Minimize size={15} /> : <Maximize size={15} />}
      </button>
      <div className="overflow-auto">
        <Preview />
      </div>
    </div>
  );
}
