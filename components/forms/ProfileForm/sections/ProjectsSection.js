// components/forms/ProfileForm/sections/ProjectsSection.js

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DeleteDialog } from "../shared/DeleteDialog";
import SortableList from "../shared/SortableList";
import DragHandle, { useSortableItem } from "../shared/DragHandle";
import {
  fieldInputClass,
  fieldTextareaClass,
  fieldCardClass,
} from "../shared/formFieldStyles";

function ProjectRow({ item, index, control, remove, skills }) {
  const { attributes, listeners, setNodeRef, style } = useSortableItem(item.id);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-col gap-4 mb-3 ${fieldCardClass}`}
    >
      <div className="flex justify-between items-start gap-6">
        <FormField
          control={control}
          name={`projects.${index}.name`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Project Name *"
                  className={`${fieldInputClass} text-[17px] font-semibold`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-3 flex-shrink-0 pt-1.5">
          <DeleteDialog
            category="Project"
            deleteHandler={() => remove(index)}
          />
          <DragHandle attributes={attributes} listeners={listeners} />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <FormField
          control={control}
          name={`projects.${index}.code_url`}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Github Link *"
                  className={fieldInputClass}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`projects.${index}.live_url`}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Live Link"
                  className={fieldInputClass}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name={`projects.${index}.skills`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <ProjectSkillsComponent skills={skills} field={field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`projects.${index}.about`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Project Description *"
                className={`${fieldTextareaClass} min-h-28 sm:min-h-20`}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export default function ProjectsSection({
  skills,
  fields,
  append,
  remove,
  move,
  control,
}) {
  return (
    <div>
      <SortableList items={fields.map((f) => f.id)} onReorder={move}>
        {fields.map((item, index) => (
          <ProjectRow
            key={item.id}
            item={item}
            index={index}
            control={control}
            remove={remove}
            skills={skills}
          />
        ))}
      </SortableList>

      <Button
        type="button"
        variant="secondary"
        className="rounded-none mt-2"
        onClick={() =>
          append({
            order: fields.length,
            name: "",
            live_url: "",
            code_url: "",
            skills: [],
            about: "",
          })
        }
        aria-label="add project"
      >
        Add Project
      </Button>
    </div>
  );
}

function ProjectSkillsComponent({ skills, field }) {
  const toggleSkillSelection = (item) => {
    let updatedSkills;
    if (field.value.includes(item)) {
      updatedSkills = field.value.filter((skill) => skill !== item);
    } else {
      updatedSkills = [...field.value, item];
    }
    field.onChange(updatedSkills);
  };

  return (
    <div>
      <div className="w-full bg-background border border-border py-2 max-h-44 overflow-auto">
        {field.value.map((item) => (
          <Badge
            key={item}
            type="button"
            variant={field.value.includes(item) ? "secondary" : "ghost"}
            onClick={() => toggleSkillSelection(item)}
            className="cursor-pointer my-2 mx-3 rounded-none"
            aria-label={`remove skill ${item}`}
          >
            {item}
          </Badge>
        ))}
        {skills
          .filter((item) => !field.value.includes(item))
          .map((item) => (
            <Badge
              key={item}
              type="button"
              variant="ghost"
              onClick={() => toggleSkillSelection(item)}
              className="cursor-pointer my-2 mx-3 rounded-none"
              aria-label={`add skill ${item}`}
            >
              {item}
            </Badge>
          ))}
        {!field.value.length && (
          <div className="w-full text-center text-destructive">
            No Skills Selected
          </div>
        )}
      </div>
    </div>
  );
}
