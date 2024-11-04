import fs from "fs";
import path from "path";
import { tasksData } from "../data/tasks.js"; // Import tasksData

const __dirname = path.dirname(
  new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1")
);

function generateTaskTree() {
  const taskDir = path.join(__dirname, "..", "components", "tasks");
  const tasks = fs
    .readdirSync(taskDir)
    .filter((item) => fs.statSync(path.join(taskDir, item)).isDirectory());
  const updatedTasksData = { ...tasksData };

  tasks.forEach((taskName) => {
    const taskPath = path.join(taskDir, taskName);
    const tree = createTree(taskPath);
    updatedTasksData[taskName] = {
      ...updatedTasksData[taskName], // Retain existing properties
      fs: tree,
    };
  });

  updateTasksFile(updatedTasksData);
}

const createTree = (dir) => {
  const structure = {};
  fs.readdirSync(dir).forEach((item) => {
    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      const nestedTree = createTree(fullPath);
      if (Object.keys(nestedTree).length > 0) {
        structure[item] = nestedTree;
      }
    } else {
      structure[item] = fs.readFileSync(fullPath, "utf8"); // Read file content instead of path
    }
  });
  return structure;
};

const updateTasksFile = (updatedTasksData) => {
  const tasksFilePath = path.join(__dirname, "..", "data", "tasks.js");
  const fileContent = `
const unsortedTasksData = ${JSON.stringify(updatedTasksData, null, 2)};

export const tasksData = Object.fromEntries(
  Object.entries(unsortedTasksData).sort(([a], [b]) => a.localeCompare(b))
);

const keys = Object.keys(tasksData);

export const getPreviousTask = (currentTask) => {
  const currentIndex = keys.indexOf(currentTask);
  return currentIndex > 0 ? keys[currentIndex - 1] : null;
};

export const getNextTask = (currentTask) => {
  const currentIndex = keys.indexOf(currentTask);
  return currentIndex !== -1 && currentIndex < keys.length - 1
    ? keys[currentIndex + 1]
    : null;
};
  `;
  fs.writeFileSync(tasksFilePath, fileContent.trim());
  console.log(`Tasks file updated: ${tasksFilePath}`);
};

// Run the function
generateTaskTree();

// run on terminal - node helpers/generateTasksTree.js
