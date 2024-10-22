import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DeleteDialog } from "../shared/DeleteDialog";
import { MoveItemTooltip } from "../shared/MoveItemTooltip";

export default function ExperienceSection({
  fields,
  append,
  remove,
  move,
  control,
}) {
  return (
    <div className="flex flex-col gap-6 my-10">
      <FormLabel className="text-2xl">Experience</FormLabel>
      {fields.map((item, index) => (
        <div
          key={item.id}
          className="flex flex-col gap-4 bg-slate-900 rounded-md p-2 mb-2"
        >
          <div className="flex justify-between items-center gap-10">
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
                        className="text-[17px] font-semibold"
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
                        className="font-semibold"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <DeleteDialog
                category="Experience"
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
              name={`experience.${index}.start`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Start Date * (e.g., Nov 2024)"
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
                    <Input {...field} placeholder="End Date (e.g., Jan 2025)" />
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
                  <Textarea {...field} placeholder="Work Description" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
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
