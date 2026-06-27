// app/loading.js

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] -m-10 gap-5">
      {/* Animated bars — the "Å" wavelength motif */}
      <div className="flex items-end gap-[3px] h-8" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="w-[3px] rounded-full bg-primary animate-pulse"
            style={{
              height: `${[40, 70, 100, 70, 40][i]}%`,
              animationDelay: `${i * 100}ms`,
              animationDuration: "1s",
            }}
          />
        ))}
      </div>

      {/* Wordmark */}
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground/50">
        angstrom
      </p>
    </div>
  );
}
