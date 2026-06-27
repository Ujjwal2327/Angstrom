// app/users/[username]/loading.js
// Shown instantly while the profile Server Component fetches data.
// Mirrors the ProfileHero + section layout so there's no layout shift on load.

export default function ProfileLoading() {
  return (
    <div className="-m-10 overflow-x-hidden animate-pulse">
      {/* ProfileHero skeleton */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8 pt-14 sm:pt-20 pb-10 border-b border-border">
        <div className="flex items-start justify-between gap-6 sm:gap-10">
          <div className="flex-1 space-y-4">
            <div className="h-3 w-24 bg-muted rounded-sm" />
            <div className="h-16 sm:h-24 w-3/4 bg-muted rounded-sm" />
            <div className="h-10 sm:h-16 w-1/2 bg-muted/60 rounded-sm" />
            <div className="h-4 w-32 bg-muted/40 rounded-sm mt-6" />
          </div>
          <div
            className="flex-shrink-0 w-20 h-20 sm:w-28 sm:h-28 bg-muted"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 78%, 78% 100%, 0 100%)",
            }}
          />
        </div>
        <div className="flex gap-5 mt-8 pt-5 border-t border-border">
          {[80, 60, 100, 70].map((w, i) => (
            <div
              key={i}
              className="h-3 bg-muted rounded-sm"
              style={{ width: w }}
            />
          ))}
        </div>
      </div>

      {/* Section skeletons */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="max-w-5xl mx-auto px-5 sm:px-8 py-16 border-b border-border space-y-6"
        >
          <div className="h-3 w-20 bg-primary/20 rounded-sm" />
          <div className="space-y-3">
            <div className="h-8 w-2/3 bg-muted rounded-sm" />
            <div className="h-4 w-full bg-muted/60 rounded-sm" />
            <div className="h-4 w-5/6 bg-muted/40 rounded-sm" />
          </div>
        </div>
      ))}
    </div>
  );
}
