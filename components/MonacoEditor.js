"use client";
import Editor from "@monaco-editor/react";

const MonacoEditor = ({ language, value }) => {
  return (
    <Editor
      height="400px"
      theme="vs-dark"
      defaultLanguage={language}
      value={value}
      options={{
        readOnly: true,
        minimap: { enabled: false },
        wordWrap: "on",
        scrollBeyondLastLine: false,
      }}
    />
  );
};

export default MonacoEditor;
