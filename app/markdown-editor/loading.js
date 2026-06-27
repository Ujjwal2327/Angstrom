// app/markdown-editor/loading.js
export default function MarkdownEditorLoading() {
  return (
    <div
      className="flex flex-col animate-pulse"
      style={{ height: "calc(var(--vh,1vh)*100 - 7.5rem)" }}
    >
      {/* Toolbar skeleton */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border bg-card">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="w-7 h-7 bg-muted/50 rounded" />
        ))}
      </div>
      {/* Editor area skeleton */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-4 space-y-3 border-r border-border">
          {[100, 60, 80, 40, 90, 55, 70].map((w, i) => (
            <div
              key={i}
              className="h-4 bg-muted/40 rounded-sm"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
        <div className="flex-1 p-4 space-y-3 hidden md:block">
          {[85, 50, 75, 35, 95, 45, 65].map((w, i) => (
            <div
              key={i}
              className="h-4 bg-muted/30 rounded-sm"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
