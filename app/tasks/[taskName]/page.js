// app/tasks/[taskName]/page.js
import { getNextTask, getPreviousTask, tasksData } from "@/data/tasks";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PreviewComponent from "@/components/tasks/PreviewComponent";
// Client wrapper — hosts the dynamic({ ssr: false }) import so this Server
// Component doesn't violate Next.js 16's restriction.
import CodeHighlighter from "@/components/tasks/CodeHighlighterWrapper";

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
        ),
      )}
    </Tabs>
  );
};

export async function generateStaticParams() {
  return Object.keys(tasksData).map((taskName) => ({ taskName }));
}

export async function generateMetadata({ params }) {
  const { taskName } = await params;
  const task = tasksData[taskName];
  if (task)
    return { title: `${taskName} | Angstrom`, description: task.description };
  return { title: `Page Not Found | Angstrom` };
}

export default async function TaskPage({ params }) {
  const { taskName } = await params;
  const task = tasksData[taskName];
  if (!task) notFound();

  const previousTask = getPreviousTask(taskName);
  const nextTask = getNextTask(taskName);

  return (
    <div className="sm:ml-64 sm:max-w-3xl flex flex-col gap-y-5">
      <div className="flex sm:justify-between sm:items-center flex-col sm:flex-row gap-y-2 gap-x-10">
        <h2 className="font-bold text-3xl">{task.name}</h2>
        <span className="text-xs text-muted-foreground">
          Duration: {task.duration} min
        </span>
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
          <div className="flex border-2 rounded-lg h-[21rem] p-5">
            <div className="flex w-full overflow-auto">
              <PreviewComponent taskName={taskName} />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="code">{renderFileTreeTabs(task.fs)}</TabsContent>
      </Tabs>

      <div className="flex justify-between items-center -mb-5">
        {previousTask ? (
          <Link
            href={previousTask}
            className="flex items-center gap-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft size={15} /> {previousTask}
          </Link>
        ) : (
          <div />
        )}
        {nextTask && (
          <Link
            href={nextTask}
            className="flex items-center gap-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {nextTask} <ChevronRight size={15} />
          </Link>
        )}
      </div>
    </div>
  );
}
