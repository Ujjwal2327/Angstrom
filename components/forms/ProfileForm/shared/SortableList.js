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
 *
 * `id` — BUGFIX: dnd-kit's DndContext auto-generates its a11y announcement id
 * (rendered as aria-describedby="DndDescribedBy-N" on drag handles) from an
 * internal incrementing counter when no id is passed. The edit page mounts
 * four separate SortableList/DndContext instances (skills, experience,
 * projects, education), and nothing guarantees they initialize in the same
 * order during the server render as during client hydration — so the
 * counter-derived N came out different on each side, producing a hydration
 * mismatch warning on every drag handle. Passing an explicit, stable id per
 * list makes the generated announcement id deterministic instead of
 * counter-based, so server and client always agree. Every call site now
 * passes a unique id (e.g. id="projects-sortable").
 */
export default function SortableList({
  items,
  onReorder,
  children,
  orientation = "vertical",
  id,
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
      id={id}
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
