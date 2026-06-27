// app/json-slicer/loading.js
export default function JsonSlicerLoading() {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-x-1 gap-y-7 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="sm:w-1/3 flex flex-col gap-y-4">
          <div className="h-7 w-32 bg-muted rounded-sm" />
          <div
            className="bg-muted/30 border border-border rounded-md flex-1"
            style={{ height: "calc(100vh - 190px)" }}
          />
          <div className="h-9 bg-muted/50 rounded-md" />
        </div>
      ))}
    </div>
  );
}
