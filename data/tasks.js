const unsortedTasksData = {
  Accordian: {
    name: "Accordian",
    description: "A component that toggles content visibility.",
    duration: 30,
  },
  TodoList: {
    name: "Todo List",
    description: "Build a simple todo list application.",
    duration: 30,
  },
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
