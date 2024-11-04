import fs from "fs";
import path from "path";
import { getNextTask, getPreviousTask, tasksData } from "@/data/tasks";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loader from "@/components/ui/Loader";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";
const CodeHighlighter = dynamic(() => import("@/components/CodeHighlighter"), {
  ssr: false,
  loading: () => <Loader />,
});

const getTaskCodeFiles = (taskName) => {
  const taskDir = path.join(process.cwd(), `components/tasks/${taskName}`);
  console.log("Resolved Task Directory:", taskDir); // Log the resolved path

  if (!fs.existsSync(taskDir)) throw new Error("Task directory not found");

  const createTree = (dir) => {
    const structure = {};
    fs.readdirSync(dir).forEach((item) => {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        const nestedTree = createTree(fullPath);
        // Add folder only if it's non-empty
        if (Object.keys(nestedTree).length > 0) {
          structure[item] = nestedTree;
        }
      } else {
        structure[item] = fs.readFileSync(fullPath, "utf8");
      }
    });
    return structure;
  };

  return createTree(taskDir);
};

const renderFileTreeTabs = (tree, parentPath = "") => {
  const defaultTab = `${parentPath}/${Object.keys(tree)[0]}`;
  return (
    <Tabs defaultValue={defaultTab} className="w-full py-0 my-0">
      <TabsList className="bg-transparent justify-start h-auto overflow-x-auto w-full">
        {Object.keys(tree).map((key) => (
          <TabsTrigger
            key={key}
            value={`${parentPath}/${key}`}
            className="text-xs py-1"
          >
            {key}
          </TabsTrigger>
        ))}
      </TabsList>
      {Object.entries(tree).map(([key, value]) =>
        typeof value === "string" ? (
          <TabsContent key={key} value={`${parentPath}/${key}`}>
            <CodeHighlighter
              code={value}
              language={key.split(".").pop()}
              className="h-[18.5rem]"
            />
          </TabsContent>
        ) : (
          <TabsContent
            key={key}
            value={`${parentPath}/${key}`}
            className="py-0 my-0"
          >
            {renderFileTreeTabs(value, `${parentPath}/${key}`)}
          </TabsContent>
        )
      )}
    </Tabs>
  );
};

export async function generateStaticParams() {
  return Object.keys(tasksData).map((taskName) => ({ taskName }));
}

export default async function TaskPage({ params }) {
  const { taskName } = params;
  const task = tasksData[taskName];
  if (!task) notFound();

  let codeFilesTree;
  try {
    codeFilesTree = getTaskCodeFiles(taskName);
  } catch (error) {
    console.error("Task Directory Error:", error.message);
    notFound();
  }
  console.log("codeFilesTree", codeFilesTree);

  const PreviewComponent = dynamic(() =>
    import(`@/components/tasks/${taskName}/index.js`).then((mod) => mod.default)
  );

  const previousTask = getPreviousTask(taskName),
    nextTask = getNextTask(taskName);

  return (
    <div className="sm:ml-64 sm:max-w-3xl flex flex-col gap-y-5">
      <div className="flex sm:justify-between sm:items-center flex-col sm:flex-row gap-y-2 gap-x-10">
        <h2 className="font-bold text-3xl">{task.name}</h2>
        <span className="text-xs">Duration: {task.duration} minutes</span>
      </div>

      <p className="text-muted-foreground">{task.description}</p>

      <Tabs defaultValue="preview">
        <TabsList className="bg-transparent">
          <TabsTrigger
            value="preview"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-b-white text-xs"
          >
            Preview
          </TabsTrigger>
          <TabsTrigger
            value="code"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-b-white text-xs"
          >
            Code
          </TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <div className="flex border-2 rounded-lg h-[21rem] p-10">
            <div className="flex w-full overflow-auto">
              <PreviewComponent />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="code">
          {renderFileTreeTabs(codeFilesTree)}
        </TabsContent>
      </Tabs>

      <div className="flex justify-between items-center -mb-5">
        {previousTask ? (
          <Link
            href={previousTask}
            className="flex justify-center items-center gap-x-2"
          >
            <ChevronLeft size={15} /> {previousTask}
          </Link>
        ) : (
          <div />
        )}
        {nextTask && (
          <Link
            href={nextTask}
            className="flex justify-center items-center gap-x-2"
          >
            {nextTask} <ChevronRight size={15} />
          </Link>
        )}
      </div>
    </div>
  );
}