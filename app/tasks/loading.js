// app/tasks/loading.js — shown inside the tasks layout while [taskName] loads
export default function TasksLoading() {
  return (
    <div className="sm:ml-64 sm:max-w-3xl flex flex-col gap-y-5 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-8 w-40 bg-muted rounded-sm" />
        <div className="h-4 w-24 bg-muted/60 rounded-sm" />
      </div>
      <div className="h-4 w-full bg-muted/40 rounded-sm" />
      <div className="h-4 w-5/6 bg-muted/30 rounded-sm" />
      {/* Tab bar */}
      <div className="flex gap-2">
        <div className="h-8 w-20 bg-muted rounded-sm" />
        <div className="h-8 w-16 bg-muted/50 rounded-sm" />
      </div>
      {/* Content area */}
      <div className="border-2 rounded-lg h-[21rem] bg-muted/20" />
    </div>
  );
}
