const unsortedTasksData = {
  "Accordian": {
    "name": "Accordian",
    "description": "A component that toggles content visibility.",
    "duration": 30,
    "fs": {
      "index.js": "\"use client\";\r\nimport { useState } from \"react\";\r\n\r\nexport default function Accordian() {\r\n  const [isOpen, setIsOpen] = useState(false);\r\n\r\n  const toggleAccordian = () => {\r\n    setIsOpen(!isOpen);\r\n  };\r\n\r\n  return (\r\n    <div className=\"accordian\">\r\n      <div className=\"accordian-header\" onClick={toggleAccordian}>\r\n        <h3>Accordian Header</h3>\r\n      </div>\r\n      {isOpen && (\r\n        <div className=\"accordian-content\">\r\n          <p>This is the accordian content.</p>\r\n        </div>\r\n      )}\r\n    </div>\r\n  );\r\n}\r\n"
    }
  },
  "TodoList": {
    "name": "Todo List",
    "description": "Build a simple todo list application.",
    "duration": 30,
    "fs": {
      "index.js": "export default function TodoList() {\r\n  return (\r\n    <div>\r\n      <h2>Todo List</h2>\r\n      <ul className=\"todolist-ul\">\r\n        <li>Task 1: Learn React</li>\r\n        <li>Task 2: Build a Todo App</li>\r\n      </ul>\r\n    </div>\r\n  );\r\n}\r\n"
    }
  }
};

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