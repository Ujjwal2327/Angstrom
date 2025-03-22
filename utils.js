import { categorizedSkills } from "./constants";

export function extractFirstLetters(str) {
  return str
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

export function handleActionError(errorMessage, throwable, returnValue) {
  if (throwable) throw new Error(errorMessage);
  else {
    console.error(errorMessage);
    return returnValue;
  }
}

export function handleCaughtActionError(
  errorMessageStart,
  errorMessage,
  throwable,
  returnValue
) {
  errorMessage = errorMessage
    ? `${errorMessageStart}: ${errorMessage}`
    : errorMessageStart;
  console.error(errorMessage);
  if (throwable) throw new Error(errorMessage);
  else return returnValue;
}

export function resolveUrl(url, defaultUrl) {
  const trimmedUrl = url.trim();
  try {
    new URL(trimmedUrl);
    return trimmedUrl;
  } catch {
    return defaultUrl;
  }
}

export function isSameObject(obj1, obj2) {
  // If both are the same object (reference check)
  if (obj1 === obj2) return true;

  // If either is not an object, or if one is null and the other is not, they can't be equal
  if (!obj1 || !obj2 || typeof obj1 !== "object" || typeof obj2 !== "object")
    return false;

  // If one is an array and the other is not, they can't be equal
  if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;

  // Check if both have the same number of properties or elements
  if (Array.isArray(obj1)) {
    if (obj1.length !== obj2.length) return false;
    // Check if all elements are equal recursively
    for (let i = 0; i < obj1.length; i++) {
      if (!isSameObject(obj1[i], obj2[i])) return false;
    }
  } else {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;

    // Check if all properties and values are equal recursively
    for (let key of keys1) {
      if (!keys2.includes(key) || !isSameObject(obj1[key], obj2[key]))
        return false;
    }
  }

  return true;
}

export function capitalizeString(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function mergeSkills() {
  const mergedSkills = {};

  for (const category in categorizedSkills) {
    const skills = categorizedSkills[category].skills;
    for (const skill in skills) mergedSkills[skill] = skills[skill];
  }

  return mergedSkills;
}

export function uniqueValidator(strings) {
  const seenStrings = new Set();
  for (const str of strings) {
    if (str.trim() === "") continue;
    if (seenStrings.has(str)) return false;
    seenStrings.add(str);
  }
  return true;
}

export function skillExistsInCategories(searchSkill) {
  if (!searchSkill || !searchSkill.trim()) return false;
  for (const category of Object.keys(categorizedSkills))
    if (categorizedSkills[category].skills[searchSkill]) return true;
  return false;
}

export function normalizeJsonValue(value) {
  try {
    const parsedValue = JSON.parse(value);
    if (typeof parsedValue === "object") return parsedValue;
  } catch (error) {}

  // value is string
  try {
    let parsedValue = value;

    // // Ensure any backticks-wrapped strings are treated properly (no effect on value)
    // parsedValue = parsedValue.replace(/`([^`]+)`/g, '"$1"');

    // Check if the value is wrapped in backticks (``) and remove them
    if (/^`.*`$/.test(parsedValue)) {
      parsedValue = parsedValue.slice(1, -1); // Remove the backticks
    }

    // Check if the value is wrapped in single quotes and remove them
    if (/^'.*'$/.test(parsedValue)) {
      parsedValue = parsedValue.slice(1, -1); // Remove the single quotes
    }

    // Check if the value is wrapped in double quotes and remove them
    if (/^".*"$/.test(parsedValue)) {
      parsedValue = parsedValue.slice(1, -1); // Remove the double quotes
    }

    // Remove any trailing commas before closing brackets or braces
    parsedValue = parsedValue.replace(/,\s*([\]}])/g, "$1");

    // Normalize the string to valid JSON format by adding quotes around object keys
    parsedValue = parsedValue.replace(/(\w+):/g, '"$1":'); // Add quotes around keys for object-like strings

    // Replace single quotes with double quotes for string values in object or array
    parsedValue = parsedValue.replace(/'([^']+)'/g, '"$1"'); // Replace single quotes with double quotes for values

    // Handle array-like structures with JSON-compliant replacements
    parsedValue = parsedValue.replace(/undefined/g, "null"); // Replace undefined with null
    parsedValue = parsedValue.replace(/\bNaN\b/g, "null"); // Replace NaN with null

    // Parse the normalized value if it looks like an array or object
    if (/^[{\[][\s\S]*[}\]]$/.test(parsedValue)) {
      parsedValue = JSON.parse(parsedValue); // Parse it as JSON
    } else {
      // Handle edge cases (e.g., converting to primitive values)
      if (parsedValue === "true" || parsedValue === "false") {
        parsedValue = parsedValue === "true"; // Convert to boolean
      } else if (!isNaN(parsedValue)) {
        parsedValue = Number(parsedValue); // Convert to number
      } else if (parsedValue === "null") {
        parsedValue = null; // Convert to null if it's the string "null"
      } else if (parsedValue === "undefined") {
        parsedValue = undefined; // Convert to undefined if it's the string "undefined"
      }
    }

    return parsedValue;
  } catch (error) {
    // Return original value if parsing fails
    return value;
  }
}
