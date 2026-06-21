"use client";
import { useEffect, useRef, useState } from "react";
import Highlight from "highlight.js";
import "highlight.js/styles/night-owl.css";
import { Check, Clipboard } from "lucide-react";

const CodeHighlighter = ({ code, language, className }) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);

  // BUGFIX: this used to call `Highlight.highlightAll()`, which re-scans and
  // re-highlights EVERY <pre><code> block currently in the DOM, not just this
  // component's own. The tasks page renders multiple CodeHighlighter
  // instances (one per file tab), so every code change anywhere re-triggered
  // a full-page re-highlight of all of them — wasted work, and highlight.js
  // v11 actively warns/can double-wrap markup when you call highlightAll on
  // an already-highlighted node. Scoping to `highlightElement(codeRef.current)`
  // only touches this instance.
  useEffect(() => {
    if (!codeRef.current) return;
    // allow re-highlighting if this same node's code/language changes
    delete codeRef.current.dataset.highlighted;
    Highlight.highlightElement(codeRef.current);
  }, [code, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 px-2 py-1 text-sm rounded"
        aria-label="copy code"
      >
        {copied ? <Check size={15} /> : <Clipboard size={15} />}
      </button>
      <pre className={`language-${language} text-sm`}>
        <code ref={codeRef} className={className}>
          {code}
        </code>
      </pre>
    </div>
  );
};

export default CodeHighlighter;
