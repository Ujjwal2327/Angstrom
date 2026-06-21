// components/forms/ProfileForm/sections/SkillsSection.js

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { categorizedSkills } from "@/constants";
import { useCallback, useState } from "react";
import { skillExistsInCategories } from "@/utils";
import { arrayMove } from "@dnd-kit/sortable";
import { GripVertical, X } from "lucide-react";
import SortableList from "../shared/SortableList";
import { useSortableItem } from "../shared/DragHandle";
import { fieldInputClass } from "../shared/formFieldStyles";

const SkillItem = ({ skill, onClick }) => (
  <div
    onClick={onClick}
    className="text-sm px-2 py-1.5 ml-2 opacity-70 hover:bg-secondary hover:opacity-100 flex gap-x-4 items-center cursor-pointer transition-colors"
    aria-label={`add skill ${skill}`}
  >
    {skill}
  </div>
);

function SortableSkillBadge({ skill, onRemove }) {
  // The skill string itself is the sortable id here — safe because skills
  // are already enforced unique before being added.
  const { attributes, listeners, setNodeRef, style } = useSortableItem(skill);

  return (
    <div ref={setNodeRef} style={style} className="my-1.5 mx-1 inline-flex">
      <Badge
        variant="secondary"
        className="rounded-none cursor-grab active:cursor-grabbing touch-none gap-1.5 pl-1.5"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-3 h-3 opacity-50" />
        {skill}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="opacity-60 hover:opacity-100 transition-opacity"
          aria-label={`remove skill ${skill}`}
        >
          <X className="w-3 h-3" />
        </button>
      </Badge>
    </div>
  );
}

export default function SkillsSection({
  fields: skills,
  append,
  remove,
  setValue,
}) {
  const [skillSearchQuery, setSkillSearchQuery] = useState("");

  const handleAddSkill = useCallback(
    (skill) => {
      const trimmedSkill = skill.trim();
      // Appended to the end — the user's chosen order is preserved, not re-sorted.
      if (!skills.includes(trimmedSkill) && trimmedSkill) {
        append(trimmedSkill);
        setSkillSearchQuery("");
      }
    },
    [skills, append],
  );

  const handleReorder = useCallback(
    (oldIndex, newIndex) => {
      setValue("skills", arrayMove(skills, oldIndex, newIndex));
    },
    [skills, setValue],
  );

  const filteredSkills = Object.entries(categorizedSkills).flatMap(
    ([category, { skills: skillSet, title }]) => {
      const availableSkills = Object.entries(skillSet).filter(
        ([skill]) =>
          !skills.includes(skill) && skill.includes(skillSearchQuery),
      );

      return availableSkills.length ? (
        <div key={category} className="select-none">
          <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground mb-2">
            {title}
          </p>
          {availableSkills.map(([skill]) => (
            <SkillItem
              key={skill}
              skill={skill}
              onClick={() => handleAddSkill(skill)}
            />
          ))}
          <Separator className="my-4" />
        </div>
      ) : (
        []
      );
    },
  );

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="md:h-[333px] w-full border border-border p-4 flex flex-wrap items-start content-start overflow-auto">
        <SortableList
          items={skills}
          onReorder={handleReorder}
          orientation="horizontal"
        >
          {skills.map((item, index) => (
            <SortableSkillBadge
              key={item}
              skill={item}
              onRemove={() => remove(index)}
            />
          ))}
        </SortableList>
        {!skills.length && (
          <div className="w-full text-center self-center opacity-35 text-sm">
            No skills selected
          </div>
        )}
      </div>
      <ScrollArea className="h-[333px] border border-border p-4 relative pt-[4.5rem]">
        <div className="p-4 absolute top-0 left-0 bg-background z-10 w-full flex justify-between gap-2 border-b border-border">
          <Input
            placeholder="Search a skill to add..."
            value={skillSearchQuery}
            onChange={(e) => {
              const skillToSave = e.target.value?.toLowerCase()?.trim();
              if (skillToSave.length <= 30) setSkillSearchQuery(skillToSave);
            }}
            className={`w-full ${fieldInputClass}`}
          />
          {skillSearchQuery && !skillExistsInCategories(skillSearchQuery) && (
            <Button
              type="button"
              variant="secondary"
              className="rounded-none flex-shrink-0"
              onClick={() => handleAddSkill(skillSearchQuery)}
              aria-label={`add skill ${skillSearchQuery}`}
            >
              Add
            </Button>
          )}
        </div>
        {filteredSkills}
      </ScrollArea>
    </div>
  );
}
