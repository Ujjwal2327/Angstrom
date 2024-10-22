import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DeleteDialog } from "../shared/DeleteDialog";
import { MoveItemTooltip } from "../shared/MoveItemTooltip";

export default function ProjectsSection({
  skills,
  fields,
  append,
  remove,
  move,
  control,
}) {
  return (
    <div className="flex flex-col gap-6 my-10">
      <FormLabel className="text-2xl">Projects</FormLabel>
      {fields.map((item, index) => (
        <div
          key={item.id}
          className="flex flex-col gap-4 bg-slate-900 rounded-md p-2 mb-2"
        >
          <div className="flex justify-between items-center gap-10">
            <FormField
              control={control}
              name={`projects.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Project Name *"
                      className="text-[17px] font-semibold"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between items-center gap-3">
              <DeleteDialog
                category="Project"
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
              name={`projects.${index}.code_url`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input {...field} placeholder="Github Link *" />
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
                    <Input {...field} placeholder="Live Link" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={control}
            name={`projects.${index}.skills`}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <ProjectSkillsComponent skills={skills} field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
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
                    className="min-h-28 sm:min-h-20"
                  />
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
      updatedSkills = [...field.value, item].sort();
    }
    field.onChange(updatedSkills);
  };

  return (
    <div>
      <div className="w-full bg-background rounded-md py-2">
        {field.value.map((item) => (
          <Badge
            key={item}
            type="button"
            variant={field.value.includes(item) ? "secondary" : "ghost"}
            onClick={() => toggleSkillSelection(item)}
            className="cursor-pointer my-2 mx-3"
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
              className="cursor-pointer my-2 mx-3"
              aria-label={`add skill ${item}`}
            >
              {item}
            </Badge>
          ))}
        {!field.value.length && (
          <div className="w-full text-center text-red-400">
            No Skills Selected
          </div>
        )}
      </div>
    </div>
  );
}
