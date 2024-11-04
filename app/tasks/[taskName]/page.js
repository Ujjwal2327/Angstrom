import fs from "fs";
import path from "path";
import { getNextTask, getPreviousTask, tasksData } from "@/data/tasks";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loader from "@/components/ui/Loader";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
const CodeHighlighter = dynamic(() => import("@/components/CodeHighlighter"), {
  ssr: false,
  loading: () => <Loader />,
});

const getTaskCodeFiles = (
  taskName,
  dirPath = `components/tasks/${taskName}`
) => {
  const taskDir = path.join(process.cwd(), dirPath);

  if (!fs.existsSync(taskDir)) throw new Error("Task directory not found");

  const files = [];

  const readDir = (currentPath, relativePath = "") => {
    fs.readdirSync(currentPath).forEach((fileOrDir) => {
      const fullPath = path.join(currentPath, fileOrDir);
      const relativeFilePath = path.join(relativePath, fileOrDir);

      if (fs.statSync(fullPath).isDirectory()) {
        // Recursively read folders
        readDir(fullPath, relativeFilePath);
      } else {
        // Add files with their relative path
        const content = fs.readFileSync(fullPath, "utf8");
        files.push({ name: relativeFilePath, content });
      }
    });
  };

  readDir(taskDir);
  return files;
};

export async function generateStaticParams() {
  return Object.keys(tasksData).map((taskName) => ({ taskName }));
}

export default async function TaskPage({ params }) {
  const { taskName } = params;
  const task = tasksData[taskName];
  if (!task) notFound();

  let codeFiles;
  try {
    codeFiles = getTaskCodeFiles(taskName);
  } catch (error) {
    console.error("Task Directory Error:", error.message);
    notFound();
  }

  const PreviewComponent = dynamic(() =>
    import(`@/components/tasks/${taskName}/index.js`).then((mod) => mod.default)
  );

  const previousTask = getPreviousTask(taskName),
    nextTask = getNextTask(taskName);

  return (
    <div className=" sm:ml-64 sm:max-w-3xl flex flex-col gap-y-5  ">
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
          <div className="flex border-2 rounded-lg h-[21rem] p-10 ">
            <div className="flex w-full overflow-auto">
              <PreviewComponent />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="code">
          <Tabs defaultValue={codeFiles[0].name} className="w-full">
            <TabsList className="bg-transparent">
              {codeFiles.map((file) => (
                <TabsTrigger
                  key={file.name}
                  value={file.name}
                  className=" rounded-none data-[state=active]:border-b data-[state=active]:border-b-white text-xs"
                >
                  {file.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {codeFiles.map((file) => (
              <TabsContent key={file.name} value={file.name}>
                <CodeHighlighter
                  code={file.content}
                  language={file.name.split(".").pop()}
                  className="h-72"
                />
              </TabsContent>
            ))}
          </Tabs>
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
