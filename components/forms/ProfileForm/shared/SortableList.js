// components/forms/ProfileForm/shared/SortableList.js

"use client";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

/**
 * Generic drag-to-reorder wrapper. Wraps any list whose items have a stable `id`.
 * `onReorder(oldIndex, newIndex)` is called with the dropped item's positions —
 * the caller is responsible for actually re-ordering the underlying data
 * (e.g. via react-hook-form's `move` from useFieldArray, or a plain array move).
 *
 * `orientation` controls the drag axis hint given to dnd-kit's sorting strategy.
 * Use "horizontal" for inline/wrapping chips (e.g. skill badges), "vertical" for stacked rows.
 */
export default function SortableList({
  items,
  onReorder,
  children,
  orientation = "vertical",
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.indexOf(active.id);
    const newIndex = items.indexOf(over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    onReorder(oldIndex, newIndex);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items}
        strategy={
          orientation === "horizontal"
            ? horizontalListSortingStrategy
            : verticalListSortingStrategy
        }
      >
        {children}
      </SortableContext>
    </DndContext>
  );
}
