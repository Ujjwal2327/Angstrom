// components/forms/ProfileForm/shared/DragHandle.js

"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

/**
 * Hook every sortable row uses to wire itself up to dnd-kit.
 * Returns `setNodeRef` + `style` for the row wrapper, and `attributes`/`listeners`
 * to spread onto whatever element should act as the drag handle (so typing in
 * inputs inside the row doesn't accidentally start a drag).
 */
export function useSortableItem(id) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : "auto",
    position: "relative",
  };

  return { attributes, listeners, setNodeRef, style, isDragging };
}

/**
 * Visual grip handle. Spread `attributes` and `listeners` from useSortableItem onto this.
 */
export default function DragHandle({ attributes, listeners, className = "" }) {
  return (
    <button
      type="button"
      {...attributes}
      {...listeners}
      className={`flex items-center justify-center w-8 h-8 border border-border cursor-grab active:cursor-grabbing touch-none text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors ${className}`}
      aria-label="drag to reorder"
    >
      <GripVertical className="w-4 h-4" />
    </button>
  );
}
