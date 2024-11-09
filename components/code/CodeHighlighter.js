"use client";
import { useEffect, useState } from "react";
import Highlight from "highlight.js";
import "highlight.js/styles/night-owl.css";
import { Check, Clipboard } from "lucide-react";

const CodeHighlighter = ({ code, language, className }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Highlight.highlightAll();
  }, [code]);

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
      >
        {copied ? <Check size={15} /> : <Clipboard size={15} />}
      </button>
      <pre className={`language-${language} text-sm`}>
        <code className={className}>{code}</code>
      </pre>
    </div>
  );
};

export default CodeHighlighter;
