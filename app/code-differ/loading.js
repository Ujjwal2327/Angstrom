// app/code-differ/loading.js
export default function CodeDifferLoading() {
  return (
    <div className="flex flex-col gap-2 animate-pulse">
      {/* Toolbar */}
      <div className="flex items-center gap-4 h-10">
        <div className="w-44 h-9 bg-muted rounded-md" />
        <div className="w-5 h-5 bg-muted rounded-sm" />
      </div>
      {/* Editor panes */}
      <div className="flex gap-2" style={{ height: "calc(100vh - 7.5rem)" }}>
        <div className="flex-1 bg-muted/30 rounded-sm border border-border" />
        <div className="flex-1 bg-muted/20 rounded-sm border border-border" />
      </div>
    </div>
  );
}
