// components/forms/ProfileForm/sections/SectionOrderSection.js
//
// Lets the user pick which order the 5 public-profile sections render in.
// Doesn't touch section *content* — a section still only shows up on the
// live profile if it actually has something in it (see
// app/users/[username]/page.js) — this only controls the sequence among
// whichever ones do. Reuses the same drag primitives as
// Skills/Experience/Projects/Education below, so the interaction is already
// familiar by the time someone reaches this control.
import { GripVertical } from "lucide-react";
import { arrayMove } from "@dnd-kit/sortable";
import SortableList from "../shared/SortableList";
import { useSortableItem } from "../shared/DragHandle";
import { sectionMeta } from "@/constants";

function SectionRow({ sectionId }) {
  const { attributes, listeners, setNodeRef, style } =
    useSortableItem(sectionId);
  const { was, label } = sectionMeta[sectionId];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between gap-4 border border-border/70 bg-card hover:border-primary/30 transition-colors duration-200 px-4 py-3 mb-2 cursor-grab active:cursor-grabbing touch-none"
      {...attributes}
      {...listeners}
    >
      <div className="font-mono text-sm">
        <span className="line-through text-muted-foreground/35 mr-2">
          {was}
        </span>
        <span className="text-foreground">{label}</span>
      </div>
      <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
    </div>
  );
}

export default function SectionOrderSection({ order, setValue }) {
  const handleReorder = (oldIndex, newIndex) => {
    setValue("sectionOrder", arrayMove(order, oldIndex, newIndex), {
      shouldDirty: true,
    });
  };

  return (
    <div>
      <SortableList
        items={order}
        onReorder={handleReorder}
        id="section-order-sortable"
      >
        {order.map((sectionId) => (
          <SectionRow key={sectionId} sectionId={sectionId} />
        ))}
      </SortableList>
      <p className="text-xs text-muted-foreground/60 mt-3">
        A section only actually shows up on your live profile once it has
        something in it — reordering an empty one is safe, it just won&apos;t
        appear until you fill it in.
      </p>
    </div>
  );
}
