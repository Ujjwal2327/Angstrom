import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { categorizedSkills } from "@/constants";
import { useCallback, useState } from "react";
import { skillExistsInCategories } from "@/utils";

const SkillItem = ({ skill, onClick }) => (
  <div
    onClick={onClick}
    className="text-sm px-2 py-1.5 ml-2 rounded-sm opacity-70 hover:bg-secondary flex gap-x-4 items-center cursor-pointer"
    aria-label={`add skill ${skill}`}
  >
    {skill}
  </div>
);

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
      if (!skills.includes(trimmedSkill) && trimmedSkill) {
        append(trimmedSkill);
        setValue("skills", [...skills, skill].sort());
        setSkillSearchQuery("");
      }
    },
    [skills, append, setValue]
  );

  const filteredSkills = Object.entries(categorizedSkills).flatMap(
    ([category, { skills: skillSet, title }]) => {
      const availableSkills = Object.entries(skillSet).filter(
        ([skill]) => !skills.includes(skill) && skill.includes(skillSearchQuery)
      );

      return availableSkills.length ? (
        <div key={category} className="select-none">
          <p className="text-sm mb-2">{title}</p>
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
    }
  );

  return (
    <div className="flex flex-col gap-6 my-10">
      <FormLabel className="text-2xl">Skills</FormLabel>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="md:h-[333px] sm:min-w-[350px] w-full rounded-md border p-4 flex flex-wrap items-center overflow-auto">
          {skills.map((item, index) => (
            <Badge
              key={item}
              type="button"
              variant="secondary"
              onClick={() => remove(index)}
              className="cursor-pointer my-2 mx-3"
              aria-label={`remove skill ${item}`}
            >
              {item}
            </Badge>
          ))}
          {!skills.length && (
            <div className="w-full text-center opacity-35">
              No Skills Selected
            </div>
          )}
        </div>
        <ScrollArea className="h-[333px] sm:min-w-[350px] rounded-md border p-4 opacity-80 relative pt-[4.5rem]">
          <div className="p-4 absolute top-0 left-0 bg-background z-10 w-full flex justify-between gap-2">
            <Input
              placeholder="Search a skill to add..."
              value={skillSearchQuery}
              onChange={(e) => {
                const skillToSave = e.target.value?.toLowerCase()?.trim();
                if (skillToSave.length <= 30) setSkillSearchQuery(skillToSave);
              }}
              className="w-full"
            />
            {skillSearchQuery && !skillExistsInCategories(skillSearchQuery) && (
              <Button
                type="button"
                variant="secondary"
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
    </div>
  );
}
