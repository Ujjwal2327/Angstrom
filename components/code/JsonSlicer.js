"use client";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { normalizeJsonValue } from "@/utils";
import { ArrowBigDown, ArrowBigRight } from "lucide-react";

export default function JsonSlicer() {
  const [inputJson, setInputJson] = useState("");
  const [parsedJson, setParsedJson] = useState(null);
  const [selectedFields, setSelectedFields] = useState({});
  const [copied, setCopied] = useState(false);

  const handleJsonInput = () => {
    try {
      const parsed = normalizeJsonValue(inputJson);
      setParsedJson(parsed);
      setSelectedFields({});
    } catch (error) {
      console.error("Invalid JSON");
    }
  };

  const toggleSelection = (path, data) => {
    setSelectedFields((prev) => {
      const newSelected = { ...prev };

      const selectAncestors = (path) => {
        const parts = path.match(/[^.[\]]+/g) || [];
        let currentPath = "";
        parts.forEach((part) => {
          currentPath += currentPath
            ? isNaN(part)
              ? `.${part}`
              : `[${part}]`
            : part;
          newSelected[currentPath] = true;
        });
      };

      const toggleChildren = (obj, currentPath, isSelected) => {
        if (Array.isArray(obj)) {
          obj.forEach((item, index) => {
            const newPath = `${currentPath}[${index}]`;
            isSelected
              ? (newSelected[newPath] = true)
              : delete newSelected[newPath];
            if (typeof item === "object" && item !== null) {
              toggleChildren(item, newPath, isSelected);
            }
          });
        } else if (typeof obj === "object" && obj !== null) {
          Object.keys(obj).forEach((key) => {
            const newPath = `${currentPath}.${key}`;
            isSelected
              ? (newSelected[newPath] = true)
              : delete newSelected[newPath];
            toggleChildren(obj[key], newPath, isSelected);
          });
        }
      };

      if (newSelected[path]) {
        delete newSelected[path];
        toggleChildren(data, path, false);
      } else {
        newSelected[path] = true;
        toggleChildren(data, path, true);
        selectAncestors(path);
      }

      return newSelected;
    });
  };

  const generateFilteredJson = (data, path = "") => {
    if (typeof data !== "object" || data === null) return data;

    if (Array.isArray(data)) {
      const filteredArray = data
        .map((item, index) => {
          const newPath = `${path}[${index}]`;
          const childExists = Object.keys(selectedFields).some((p) =>
            p.startsWith(newPath)
          );
          return selectedFields[newPath] || childExists
            ? generateFilteredJson(item, newPath)
            : null;
        })
        .filter((item) => item !== null);
      return selectedFields[path]
        ? filteredArray
        : filteredArray.length > 0
        ? filteredArray
        : undefined;
    }

    return Object.keys(data).reduce((acc, key) => {
      const newPath = path ? `${path}.${key}` : key;
      const childExists = Object.keys(selectedFields).some((p) =>
        p.startsWith(newPath)
      );
      if (selectedFields[newPath] || childExists) {
        acc[key] = generateFilteredJson(data[key], newPath);
      }
      return acc;
    }, {});
  };

  const copyToClipboard = () => {
    const resultJson = JSON.stringify(
      generateFilteredJson(parsedJson),
      null,
      4
    );
    navigator.clipboard.writeText(resultJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderJsonTree = (data, path = "") => {
    if (typeof data !== "object" || data === null) return null;

    if (Array.isArray(data)) {
      return data.map((item, index) => {
        const newPath = `${path}[${index}]`;
        const isChecked = !!selectedFields[newPath];
        return (
          <div key={newPath} className="ml-4">
            <label className="flex items-center gap-x-2">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleSelection(newPath, item)}
              />
              <span>[{index}]</span>
            </label>
            {typeof item === "object" &&
              item !== null &&
              renderJsonTree(item, newPath)}
          </div>
        );
      });
    }

    return Object.keys(data).map((key) => {
      const newPath = path ? `${path}.${key}` : key;
      const isChecked = !!selectedFields[newPath];
      return (
        <div key={newPath} className="ml-4">
          <label className="flex items-center gap-x-2">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => toggleSelection(newPath, data[key])}
            />
            <span>{key}</span>
          </label>
          {typeof data[key] === "object" &&
            data[key] !== null &&
            renderJsonTree(data[key], newPath)}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col sm:flex-row  sm:items-center gap-1">
        <div className="sm:w-1/3 flex flex-col gap-y-5">
          <h2 className="font-bold text-xl">Input JSON</h2>
          <Textarea
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            className="w-full h-[calc(100vh-190px)] resize-none"
          />
          <Button onClick={handleJsonInput}>Parse JSON</Button>
        </div>
        <ArrowBigRight className="size-10 hidden sm:block" />
        <ArrowBigDown className="size-10 self-center sm:hidden" />

        <div className="sm:w-1/3 flex flex-col gap-y-5">
          <h2 className="font-bold text-xl">Filter Fields</h2>
          <div className="w-full h-[calc(100vh-190px)] overflow-auto border p-2">
            {parsedJson !== null && renderJsonTree(parsedJson)}
          </div>
        </div>
        <ArrowBigRight className="size-10 hidden sm:block" />
        <ArrowBigDown className="size-10 self-center sm:hidden" />

        <div className="sm:w-1/3 max-w-1/3 flex flex-col gap-y-5">
          <h2 className="font-bold text-xl">Result JSON</h2>
          <pre className="w-full h-[calc(100vh-190px)] overflow-auto border p-2">
            {JSON.stringify(generateFilteredJson(parsedJson), null, 4)}
          </pre>
          <Button onClick={copyToClipboard}>
            {copied ? "Copied!" : "Copy JSON"}
          </Button>
        </div>
      </div>
    </div>
  );
}
