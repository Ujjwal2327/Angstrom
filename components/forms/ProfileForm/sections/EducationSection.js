import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DeleteDialog } from "../shared/DeleteDialog";
import { MoveItemTooltip } from "../shared/MoveItemTooltip";

export default function EducationSection({
  fields,
  append,
  remove,
  move,
  control,
}) {
  return (
    <div className="flex flex-col gap-6 my-10">
      <FormLabel className="text-2xl">Education</FormLabel>
      {fields.map((item, index) => (
        <div
          key={item.id}
          className="flex flex-col gap-4 bg-slate-900 rounded-md p-2 mb-2"
        >
          <div className="flex justify-between items-center gap-10">
            <FormField
              control={control}
              name={`education.${index}.degree`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Degree *"
                      className="text-[17px] font-semibold"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between items-center gap-3">
              <DeleteDialog
                category="Education"
                deleteHandler={() => remove(index)}
              />
              <MoveItemTooltip
                index={index}
                fieldsLength={fields.length}
                moveHandler={move}
              />
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
                      className="font-semibold"
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
                    <Input {...field} placeholder="Score" />
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
                  <Input {...field} placeholder="Institution Name *" />
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
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
