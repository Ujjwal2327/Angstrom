// components/forms/ProfileForm/sections/EducationSection.js

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DeleteDialog } from "../shared/DeleteDialog";
import SortableList from "../shared/SortableList";
import DragHandle, { useSortableItem } from "../shared/DragHandle";
import { fieldInputClass, fieldCardClass } from "../shared/formFieldStyles";

function EducationRow({ item, index, control, remove }) {
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
          name={`education.${index}.degree`}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Degree *"
                  className={`${fieldInputClass} text-[17px] font-semibold`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-3 flex-shrink-0 pt-1.5">
          <DeleteDialog
            category="Education"
            deleteHandler={() => remove(index)}
          />
          <DragHandle attributes={attributes} listeners={listeners} />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <FormField
          control={control}
          name={`education.${index}.specialization`}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Specialization"
                  className={`${fieldInputClass} font-semibold`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`education.${index}.score`}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Score"
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
        name={`education.${index}.institution`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                {...field}
                placeholder="Institution Name *"
                className={fieldInputClass}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <FormField
          control={control}
          name={`education.${index}.start`}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Start Date * (e.g., Nov 2020)"
                  className={fieldInputClass}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`education.${index}.end`}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Start Date (e.g., Aug 2024)"
                  className={fieldInputClass}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export default function EducationSection({
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
          <EducationRow
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
            institution: "",
            degree: "",
            specialization: "",
            start: "",
            end: "",
          })
        }
        aria-label="add education"
      >
        Add Education
      </Button>
    </div>
  );
}
