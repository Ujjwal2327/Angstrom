// components/forms/ProfileForm/shared/formFieldStyles.js

// Sharp-cornered inputs with cyan focus — matches the portfolio's identity.
// Applied as className overrides on shadcn Input/Textarea primitives.
export const fieldInputClass =
  "rounded-none border-border/70 bg-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary hover:border-border transition-colors duration-150 placeholder:text-muted-foreground/40";

export const fieldTextareaClass = `${fieldInputClass} resize-none`;

// Mono uppercase tracking label — the "// about" eyebrow style
export const fieldLabelClass =
  "font-mono text-[0.68rem] uppercase tracking-[0.1em] text-muted-foreground";

// Card wrapper for draggable rows (experience / projects / education)
export const fieldCardClass =
  "border border-border/70 bg-card hover:border-primary/30 transition-colors duration-200 p-4 sm:p-5";
