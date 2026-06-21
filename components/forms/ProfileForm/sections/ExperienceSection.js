// components/forms/ProfileForm/sections/ExperienceSection.js

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
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

function ExperienceRow({ item, index, control, remove }) {
  const { attributes, listeners, setNodeRef, style } = useSortableItem(item.id);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-col gap-4 mb-3 ${fieldCardClass}`}
    >
      <div className="flex justify-between items-start gap-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <FormField
            control={control}
            name={`experience.${index}.company`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Company Name *"
                    className={`${fieldInputClass} text-[17px] font-semibold`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`experience.${index}.position`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Position *"
                    className={`${fieldInputClass} font-semibold`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 pt-1.5">
          <DeleteDialog
            category="Experience"
            deleteHandler={() => remove(index)}
          />
          <DragHandle attributes={attributes} listeners={listeners} />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <FormField
          control={control}
          name={`experience.${index}.start`}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Start Date * (e.g., Nov 2024)"
                  className={fieldInputClass}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`experience.${index}.end`}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  {...field}
                  placeholder="End Date (e.g., Jan 2025)"
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
        name={`experience.${index}.about`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Work Description"
                className={fieldTextareaClass}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export default function ExperienceSection({
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
          <ExperienceRow
            key={item.id}
            item={item}
            index={index}
            control={control}
            remove={remove}
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
            company: "",
            position: "",
            start: "",
            end: "",
            about: "",
          })
        }
        aria-label="add experience"
      >
        Add Experience
      </Button>
    </div>
  );
}
