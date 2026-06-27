// app/users/[username]/edit/loading.js
export default function EditLoading() {
  return (
    <div className="-m-10 animate-pulse">
      {/* Sticky header skeleton */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="h-2 w-14 bg-muted rounded-sm" />
            <div className="h-4 w-24 bg-muted/60 rounded-sm" />
          </div>
          <div className="h-3 w-32 bg-muted/40 rounded-sm" />
        </div>
      </div>

      {/* Form skeleton */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8 pb-24 space-y-0">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="py-14 border-b border-border space-y-8">
            <div className="h-3 w-20 bg-primary/20 rounded-sm" />
            <div className="space-y-4">
              <div className="h-10 bg-muted rounded-none" />
              <div className="h-10 bg-muted/70 rounded-none" />
              <div className="h-24 bg-muted/50 rounded-none" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
