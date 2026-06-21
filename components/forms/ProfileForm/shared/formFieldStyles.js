// components/forms/ProfileForm/shared/formFieldStyles.js

// Sharp-cornered, cyan-focus input language matching the bold view-page identity.
// Applied as className overrides on shadcn primitives (Input/Textarea), not by
// editing the primitives themselves.
export const fieldInputClass =
  "rounded-none border-border bg-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-colors";

export const fieldTextareaClass = `${fieldInputClass} resize-none`;

// Mono, uppercase, tracked-out — matches the "// about" style section labels
// and the @handle treatment from the view page.
export const fieldLabelClass =
  "font-mono text-[0.7rem] uppercase tracking-[0.08em] text-muted-foreground";

// Sharp-cornered card wrapper used for each row in a draggable list
// (experience/projects/education) and other grouped field clusters.
export const fieldCardClass =
  "border border-border bg-card hover:border-primary/40 transition-colors p-4 sm:p-5";
