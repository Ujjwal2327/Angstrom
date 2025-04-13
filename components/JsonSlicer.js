"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { normalizeJsonValue } from "@/utils";
import {
  ArrowBigDown,
  ArrowBigRight,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

const initialInputJson = {
  testArray: [0, 1, 2, "three", true, false, null],
  isAdmin: false,
  user: {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    profile: {
      age: 30,
      gender: "Male",
      location: {
        city: "New York",
        country: "USA",
        coordinates: {
          latitude: 40.7128,
          longitude: -74.006,
        },
      },
    },
  },
  posts: [
    {
      id: 101,
      title: "First Post",
      tags: ["tech", "json", "react"],
      content: "This is my first post!",
      comments: [
        {
          id: 201,
          user: "Alice",
          message: "Great post!",
          replies: [],
        },
        {
          id: 202,
          user: "Bob",
          message: "Nice article",
          replies: [
            {
              id: 301,
              user: "Charlie",
              message: "I agree with Bob!",
            },
          ],
        },
      ],
    },
    {
      id: 102,
      title: "Second Post",
      content: "This is another post.",
      tags: [],
      comments: [],
    },
  ],
  settings: {
    language: "en",
    privacy: {
      profileVisibility: "public",
      searchEngineIndexing: false,
    },
    notifications: {
      email: true,
      sms: false,
      push: {
        enabled: true,
        frequency: "daily",
      },
    },
  },
  metadata: {
    createdAt: "2025-03-22T10:00:00Z",
    updatedAt: null,
    tags: ["sample", "example"],
  },
};

export default function JsonSlicer() {
  // State for storing the input JSON (either as string or object)
  const [inputJson, setInputJson] = useState(initialInputJson);
  // State for storing the normalized parsed JSON object
  const [parsedJson, setParsedJson] = useState({});
  // Tracks which fields are selected in the JSON tree (path -> boolean)
  const [selectedFields, setSelectedFields] = useState({});
  // Tracks which nodes are expanded in the tree view (path -> boolean)
  const [expandedNodes, setExpandedNodes] = useState({});
  // Tracks whether the result JSON has been copied to clipboard
  const [copied, setCopied] = useState(false);
  // Controls whether selecting an array item selects all siblings
  const [bulkSelectionMode, setBulkSelectionMode] = useState(false);
  // Tracks if the root JSON is an array (affects path handling)
  const [isTopLevelArray, setIsTopLevelArray] = useState(false);

  // Parses the input JSON and resets selection state
  const handleJsonInput = useCallback(() => {
    try {
      // Normalize the input (handles both string and object inputs)
      const parsed = normalizeJsonValue(inputJson);
      setParsedJson(parsed);
      // Reset selections and expansions when JSON changes
      setSelectedFields({});
      setExpandedNodes({});
      // Special handling needed for top-level arrays
      setIsTopLevelArray(Array.isArray(parsed));
    } catch (error) {
      console.error("Invalid JSON");
    }
  }, [inputJson]);

  // Parse the JSON on initial load
  useEffect(() => {
    handleJsonInput();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Extracts array path information from a dot notation path
  // e.g., "posts[0].comments" -> { arrayPath: "posts", index: 0, remainder: ".comments" }
  const getArrayInfo = useCallback((path) => {
    const matches = path.match(/^(.*?)(\[\d+\])(.*)$/);
    if (!matches) return null;
    const [, arrayName, indexBracket, remainder] = matches;
    return {
      arrayPath: arrayName,
      index: parseInt(indexBracket.slice(1, -1), 10),
      remainder,
    };
  }, []);

  // Gets all sibling paths for an array element
  // Used in bulk selection mode to select all items in an array
  const getSiblingPaths = useCallback(
    (path, data) => {
      // Handle top-level arrays differently (they have no parent)
      if (isTopLevelArray && path.match(/^\[\d+\]$/)) {
        const siblingPaths = [];
        for (let i = 0; i < data.length; i++) {
          siblingPaths.push(`[${i}]`);
        }
        return siblingPaths;
      }

      const arrayInfo = getArrayInfo(path);
      if (!arrayInfo) return [path]; // Not an array element

      const { arrayPath, remainder } = arrayInfo;
      const siblingPaths = [];

      // Navigate to the array in the data structure
      let arrayData = data;
      if (arrayPath) {
        const segments = arrayPath.split(".");
        for (const segment of segments) {
          if (!arrayData || typeof arrayData !== "object") return [path];
          arrayData = arrayData[segment];
        }
      }

      // Generate paths for all elements in the array
      if (Array.isArray(arrayData)) {
        for (let i = 0; i < arrayData.length; i++) {
          siblingPaths.push(`${arrayPath ? arrayPath : ""}[${i}]${remainder}`);
        }
      }

      return siblingPaths;
    },
    [getArrayInfo, isTopLevelArray]
  );

  // Retrieves the data at a specific path in the JSON structure
  const getDataAtPath = useCallback(
    (path, data) => {
      // Special case for top-level array elements
      if (isTopLevelArray && path.match(/^\[\d+\]$/)) {
        const index = parseInt(path.slice(1, -1), 10);
        return data[index];
      }

      if (!path) return data;
      // Split path into segments, handling both dot notation and array indices
      const segments = path.split(/\.|\[|\]/).filter(Boolean);
      let current = data;

      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        if (!current || typeof current !== "object") return undefined;

        // Handle array access with numeric indices
        if (
          i < segments.length - 1 &&
          segments[i + 1] &&
          !isNaN(segments[i + 1])
        ) {
          // Access array element: obj[key][index]
          current = current[segment]?.[parseInt(segments[++i], 10)];
        } else {
          // Regular property access: obj[key]
          current = current[segment];
        }
      }
      return current;
    },
    [isTopLevelArray]
  );

  // When selecting a node, also select all its parent nodes
  // This ensures the path to the selected node is included in the result
  const selectAncestors = useCallback(
    (path, newSelected) => {
      // Top-level array items have no ancestors
      if (isTopLevelArray && path.match(/^\[\d+\]$/)) {
        return newSelected;
      }

      // Build up the path segments and mark each ancestor as selected
      const parts = path.match(/[^.[\]]+/g) || [];
      let currentPath = "";
      parts.forEach((part) => {
        // Build the path incrementally, handling both object properties and array indices
        currentPath += currentPath
          ? isNaN(part)
            ? `.${part}`
            : `[${part}]`
          : part;
        newSelected[currentPath] = true;
      });
      return newSelected;
    },
    [isTopLevelArray]
  );

  // Recursively toggle selection for all children of a node
  // Used when selecting/deselecting a parent node to affect all its children
  const toggleChildren = useCallback(
    (obj, currentPath, isSelected, newSelected) => {
      if (!obj || typeof obj !== "object") return newSelected;

      if (Array.isArray(obj)) {
        // For arrays, toggle each array element
        obj.forEach((item, index) => {
          const newPath = `${currentPath}[${index}]`;
          // Add or remove the path based on selection state
          isSelected
            ? (newSelected[newPath] = true)
            : delete newSelected[newPath];

          // Recursively handle nested objects/arrays
          if (typeof item === "object" && item !== null) {
            toggleChildren(item, newPath, isSelected, newSelected);
          }
        });
      } else {
        // For objects, toggle each property
        Object.keys(obj).forEach((key) => {
          const newPath = `${currentPath}.${key}`;
          isSelected
            ? (newSelected[newPath] = true)
            : delete newSelected[newPath];

          // Recursively handle nested objects/arrays
          if (typeof obj[key] === "object" && obj[key] !== null) {
            toggleChildren(obj[key], newPath, isSelected, newSelected);
          }
        });
      }
      return newSelected;
    },
    []
  );

  // Main handler for toggling selection of a node in the JSON tree
  const toggleSelection = useCallback(
    (path, data) => {
      setSelectedFields((prev) => {
        const newSelected = { ...prev };
        const isSelected = !newSelected[path]; // Toggle current selection state

        if (bulkSelectionMode && path.includes("[")) {
          // In bulk mode, select/deselect all siblings in the array
          const siblingPaths = getSiblingPaths(path, parsedJson);

          // Process each sibling path
          siblingPaths.forEach((siblingPath) => {
            const siblingData = getDataAtPath(siblingPath, parsedJson);
            if (isSelected) {
              // Select the sibling
              newSelected[siblingPath] = true;
              // Select all ancestors to ensure path is complete
              selectAncestors(siblingPath, newSelected);
              // Select all children of the sibling
              if (siblingData && typeof siblingData === "object") {
                toggleChildren(siblingData, siblingPath, true, newSelected);
              }
            } else {
              // Deselect the sibling
              delete newSelected[siblingPath];
              // Deselect all children of the sibling
              if (siblingData && typeof siblingData === "object") {
                toggleChildren(siblingData, siblingPath, false, newSelected);
              }
            }
          });
        } else {
          // Regular selection mode (single node)
          if (isSelected) {
            // Select the node
            newSelected[path] = true;
            // Select all children
            toggleChildren(data, path, true, newSelected);
            // Select all ancestors
            selectAncestors(path, newSelected);
          } else {
            // Deselect the node
            delete newSelected[path];
            // Deselect all children
            toggleChildren(data, path, false, newSelected);
          }
        }
        return newSelected;
      });
    },
    [
      bulkSelectionMode,
      getDataAtPath,
      getSiblingPaths,
      parsedJson,
      selectAncestors,
      toggleChildren,
    ]
  );

  // Toggles expansion state of a node in the tree view
  const toggleNodeExpansion = useCallback((path) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [path]: !prev[path], // Toggle expansion state
    }));
  }, []);

  // Expands all nodes in the JSON tree for better visibility
  const expandAllNodes = useCallback(() => {
    // Recursively builds a map of all possible paths to expand
    const expandAll = (obj, path = "") => {
      if (!obj || typeof obj !== "object") return {};
      let expanded = {};

      if (Array.isArray(obj)) {
        // Handle array elements
        obj.forEach((item, index) => {
          const newPath = path ? `${path}[${index}]` : `[${index}]`;
          expanded[newPath] = true; // Mark this path as expanded

          // Recursively expand nested objects
          if (typeof item === "object" && item !== null) {
            Object.assign(expanded, expandAll(item, newPath));
          }
        });
      } else {
        // Handle object properties
        Object.keys(obj).forEach((key) => {
          const newPath = path ? `${path}.${key}` : key;
          expanded[newPath] = true; // Mark this path as expanded

          // Recursively expand nested objects
          if (typeof obj[key] === "object" && obj[key] !== null) {
            Object.assign(expanded, expandAll(obj[key], newPath));
          }
        });
      }
      return expanded;
    };

    // Set all paths to expanded state
    setExpandedNodes(expandAll(parsedJson));
  }, [parsedJson]);

  // Collapses all nodes in the JSON tree
  const collapseAllNodes = useCallback(() => {
    setExpandedNodes({}); // Empty object means no nodes are expanded
  }, []);

  // Generates the filtered JSON based on selected fields
  // This is the core function that creates the output JSON
  const generateFilteredJson = useCallback(
    (data, path = "") => {
      // Handle primitive values directly
      if (typeof data !== "object" || data === null) return data;

      // Special case for top-level array
      if (isTopLevelArray && Array.isArray(data)) {
        // Filter the array elements based on selection
        const filteredArray = data
          .map((item, index) => {
            const itemPath = `[${index}]`;
            // Keep selected items, mark others as undefined (to be filtered out)
            return selectedFields[itemPath] ? item : undefined;
          })
          .filter((item) => item !== undefined); // Remove undefined items

        return filteredArray;
      }

      if (Array.isArray(data)) {
        // Process regular nested arrays
        const filteredArray = data
          .map((item, index) => {
            const newPath = `${path}[${index}]`;
            // Check if this item or any of its children are selected
            const childExists = Object.keys(selectedFields).some((p) =>
              p.startsWith(newPath)
            );

            if (selectedFields[newPath] || childExists) {
              // Recursively process the item
              return generateFilteredJson(item, newPath);
            }
            return undefined; // Mark unselected items as undefined
          })
          .filter((item) => item !== undefined); // Remove undefined items

        return filteredArray;
      }

      // Process objects
      const result = {};
      for (const key of Object.keys(data)) {
        const newPath = path ? `${path}.${key}` : key;
        // Check if this property or any of its children are selected
        const childExists = Object.keys(selectedFields).some((p) =>
          p.startsWith(newPath)
        );

        if (selectedFields[newPath] || childExists) {
          // Include the property and recursively process its value
          result[key] = generateFilteredJson(data[key], newPath);
        }
      }
      return result;
    },
    [selectedFields, isTopLevelArray]
  );

  // Copies the filtered JSON to clipboard
  const copyToClipboard = useCallback(() => {
    // Generate the filtered JSON and format it with indentation
    const resultJson = JSON.stringify(
      generateFilteredJson(parsedJson),
      null,
      4
    );
    // Use clipboard API to copy the text
    navigator.clipboard.writeText(resultJson);
    // Show feedback to user
    setCopied(true);
    // Reset the copied state after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  }, [generateFilteredJson, parsedJson]);

  // Renders the interactive JSON tree with checkboxes and expand/collapse controls
  const renderJsonTree = useCallback(
    (data, path = "") => {
      if (typeof data !== "object" || data === null) return null;

      if (Array.isArray(data)) {
        // Render array elements
        const isTopArray = isTopLevelArray && path === "";
        return data.map((item, index) => {
          // Generate the path for this array element
          const newPath = isTopArray ? `[${index}]` : `${path}[${index}]`;
          const isChecked = !!selectedFields[newPath];
          const isExpanded = !!expandedNodes[newPath];
          const hasChildren = typeof item === "object" && item !== null;

          return (
            <div key={newPath} className="ml-4">
              <div className="flex items-center gap-x-2">
                {/* Checkbox for selecting the item */}
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleSelection(newPath, item)}
                  className="mr-1"
                />
                {/* Expand/collapse button for objects/arrays */}
                {hasChildren ? (
                  <button
                    onClick={() => toggleNodeExpansion(newPath)}
                    className="focus:outline-none p-1"
                    aria-label={isExpanded ? "Collapse" : "Expand"}
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                ) : (
                  <span className="w-6"></span> // Spacer for alignment
                )}
                {/* Array index label */}
                <span>[{index}]</span>
                {/* Display primitive values directly */}
                {!hasChildren && (
                  <span className="text-gray-500 text-sm ml-2">
                    {typeof item === "string"
                      ? `"${item}"` // Show strings with quotes
                      : item === null
                      ? "null" // Special handling for null
                      : item === undefined
                      ? "undefined" // Special handling for undefined
                      : String(item)}{" "}
                  </span>
                )}
                {/* Show summary for collapsed objects/arrays */}
                {!isExpanded && hasChildren && (
                  <span className="text-gray-500 text-sm ml-2">
                    {Array.isArray(item)
                      ? `[${item.length} items]` // Show array length
                      : `{${Object.keys(item).length} properties}`}{" "}
                  </span>
                )}
              </div>
              {/* Recursively render children if expanded */}
              {hasChildren && isExpanded && renderJsonTree(item, newPath)}
            </div>
          );
        });
      }

      // Render object properties
      return Object.keys(data).map((key) => {
        const newPath = path ? `${path}.${key}` : key;
        const isChecked = !!selectedFields[newPath];
        const isExpanded = !!expandedNodes[newPath];
        const hasChildren = typeof data[key] === "object" && data[key] !== null;

        return (
          <div key={newPath} className="ml-4">
            <div className="flex items-center gap-x-2">
              {/* Checkbox for selecting the property */}
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleSelection(newPath, data[key])}
                className="mr-1"
              />
              {/* Expand/collapse button for objects/arrays */}
              {hasChildren ? (
                <button
                  onClick={() => toggleNodeExpansion(newPath)}
                  className="focus:outline-none p-1"
                  aria-label={isExpanded ? "Collapse" : "Expand"}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              ) : (
                <span className="w-6"></span> // Spacer for alignment
              )}
              {/* Property name */}
              <span>{key}</span>
              {/* Display primitive values directly */}
              {!hasChildren && (
                <span className="text-gray-500 text-sm ml-2">
                  {typeof data[key] === "string"
                    ? `"${data[key]}"` // Show strings with quotes
                    : data[key] === null
                    ? "null" // Special handling for null
                    : data[key] === undefined
                    ? "undefined" // Special handling for undefined
                    : String(data[key])}{" "}
                </span>
              )}
              {/* Show summary for collapsed objects/arrays */}
              {!isExpanded && hasChildren && (
                <span className="text-gray-500 text-sm ml-2">
                  {Array.isArray(data[key])
                    ? `[${data[key].length} items]` // Show array length
                    : `{${Object.keys(data[key]).length} properties}`}{" "}
                </span>
              )}
            </div>
            {/* Recursively render children if expanded */}
            {hasChildren && isExpanded && renderJsonTree(data[key], newPath)}
          </div>
        );
      });
    },
    [
      selectedFields,
      expandedNodes,
      toggleNodeExpansion,
      toggleSelection,
      isTopLevelArray,
    ]
  );

  // Memoize the filtered JSON result to avoid unnecessary recalculations
  const filteredJsonResult = useMemo(
    () => JSON.stringify(generateFilteredJson(parsedJson), null, 4),
    [generateFilteredJson, parsedJson]
  );

  // Memoize the input JSON string representation
  const inputJsonString = useMemo(
    () =>
      typeof inputJson === "string"
        ? inputJson
        : JSON.stringify(inputJson, null, 2),
    [inputJson]
  );

  return (
    <div className="flex flex-col">
      <div className="flex flex-col sm:flex-row sm:gap-x-1 gap-y-7">
        {/* Input JSON panel */}
        <div className="sm:w-1/3 flex flex-col gap-y-5">
          <h2 className="font-bold text-xl">Input JSON</h2>
          <Textarea
            value={inputJsonString}
            onChange={(e) => setInputJson(e.target.value)}
            className="w-full h-[calc(100vh-190px)] resize-none"
          />
          <Button onClick={handleJsonInput}>Parse JSON</Button>
        </div>
        {/* Arrows for visual flow */}
        <ArrowBigRight className="size-10 self-center hidden sm:block" />
        <ArrowBigDown className="size-10 self-center sm:hidden" />
        {/* JSON tree selection panel */}
        <div className="sm:w-1/3 flex flex-col gap-y-5">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-xl">Filter Fields</h2>
            <div className="flex items-center space-x-2">
              <Switch
                id="bulk-mode"
                checked={bulkSelectionMode}
                onCheckedChange={setBulkSelectionMode}
              />
              <Label htmlFor="bulk-mode">Bulk Selection Mode</Label>
            </div>
          </div>
          <div className="flex justify-between mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={expandAllNodes}
              className="text-xs"
            >
              Expand All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={collapseAllNodes}
              className="text-xs"
            >
              Collapse All
            </Button>
          </div>
          <div className="w-full h-[calc(100vh-194px)] rounded-md overflow-auto border p-2">
            {parsedJson !== null && renderJsonTree(parsedJson)}
          </div>
        </div>
        {/* Arrows for visual flow */}
        <ArrowBigRight className="size-10 self-center hidden sm:block" />
        <ArrowBigDown className="size-10 self-center sm:hidden" />
        {/* Result JSON panel */}
        <div className="sm:w-1/3 max-w-1/3 flex flex-col gap-y-5">
          <h2 className="font-bold text-xl">Result JSON</h2>
          <pre className="w-full h-[calc(100vh-190px)] rounded-md overflow-auto border p-2">
            {filteredJsonResult}
          </pre>
          <Button onClick={copyToClipboard}>
            {copied ? "Copied!" : "Copy JSON"}
          </Button>
        </div>
      </div>
    </div>
  );
}
