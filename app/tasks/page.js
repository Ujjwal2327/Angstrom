export default function TasksPage() {
  return (
    <div className=" sm:ml-64 sm:max-w-3xl flex flex-col gap-y-5  ">
      <h2 className="font-bold text-3xl">Tasks</h2>
      <p className="text-muted-foreground">
        This platform offers interactive coding tasks for interview preparation.
        Use the tabs to view a live preview or explore the code.
      </p>
      <div className="instructions mt-4">
        <h2 className="text-lg font-medium">How to Use:</h2>
        <ol className="list-disc list-inside text-muted-foreground space-y-2">
          <li>Choose a task, review its description, and view the preview.</li>
          <li>
            Try to implement it on your own from scratch within the suggested
            duration.
          </li>
          <li>
            If you’re stuck or can’t finish on time, explore the provided code
            snippets to understand the solution.
          </li>
        </ol>
      </div>
    </div>
  );
}
