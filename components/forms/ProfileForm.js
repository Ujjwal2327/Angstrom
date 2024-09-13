"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Image from "next/image";
import { profiles, categorizedSkills } from "@/constants";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RotateCcw, Trash } from "lucide-react";
import useStore from "@/stores/useStore";
import { useRouter } from "next/navigation";
import Spinner from "../Spinner";
import dynamic from "next/dynamic";
const Tiptap = dynamic(() => import("@/components/Tiptap/Tiptap"), {
  ssr: false,
});

// Define form schema
const projectSchema = z
  .object({
    name: z.string().min(1, { message: "Project name is required" }).trim(),
    code_url: z.string().url({ message: "Invalid URL" }).trim(),
    live_url: z.string().trim().optional(),
    skills: z
      .array(z.string().trim())
      .refine(
        (skills) => skills.filter((skill) => skill.trim() !== "").length > 0,
        {
          message: "At least one non-empty skill is required",
        }
      ),
    about: z.string().min(1, { message: "Project description is required" }),
  })
  .transform((data) => {
    const filteredSkills = data.skills.filter((skill) => skill.trim() !== "");
    return {
      ...data,
      live_url: data.live_url || data.code_url,
      skills: filteredSkills,
    };
  });

const educationSchema = z
  .object({
    college: z.string().min(1, { message: "College name is required" }).trim(),
    degree: z.string().min(1, { message: "Degree is required" }).trim(),
    specialization: z.string().trim().optional(),
    score: z.string().trim().optional(),
    start: z.string().min(1, { message: "Start date is required" }).trim(),
    end: z.string().trim().optional(),
  })
  .transform((data) => ({
    ...data,
    end: data.end || "Present",
  }));

const experienceSchema = z
  .object({
    company: z.string().min(1, { message: "Company name is required" }).trim(),
    position: z.string().min(1, { message: "Position is required" }).trim(),
    start: z.string().min(1, { message: "Start date is required" }).trim(),
    end: z.string().trim().optional(),
    about: z.string().min(1, { message: "Description is required" }).trim(),
  })
  .transform((data) => ({
    ...data,
    end: data.end || "Present",
  }));

function uniqueValidator(items) {
  const seen = new Set();
  for (const item of items) {
    if (item.trim() === "") continue;
    if (seen.has(item)) return false;
    seen.add(item);
  }
  return true;
}

const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(15, { message: "Username must be at most 15 characters." })
    .trim()
    .refine((username) => !/\s/.test(username), {
      message: "Username must not contain spaces.",
    })
    .transform((username) => username.toLowerCase()),
  email: z.string().email({ message: "Invalid email" }).trim(),
  firstname: z.string().trim().optional(),
  lastname: z.string().trim().optional(),
  pic: z.string().url().trim().optional(),
  about: z.string().trim().optional(),
  achievements: z
    .string()
    .trim()
    .optional()
    .transform((val) => {
      return val === "<p></p>" || val === "<h2></h2>" ? "" : val;
    }),
  skills: z.array(
    z
      .string()
      .min(1, { message: "Project must have at least one skill" })
      .trim()
  ),
  profiles: z
    .record(z.string().trim(), z.string().trim().optional())
    .transform((profiles) => {
      return Object.fromEntries(
        Object.entries(profiles).filter(([key, value]) => value !== "")
      );
    }),
  projects: z.array(projectSchema).refine(
    (projects) => {
      const projectNames = projects.map((item) => item.name);
      return uniqueValidator(projectNames);
    },
    { message: "Project names must be unique." }
  ),
  education: z.array(educationSchema).refine(
    (education) => {
      const degrees = education.map((item) => item.degree);
      return uniqueValidator(degrees);
    },
    {
      message: "Degrees must be unique.",
    }
  ),
  experience: z.array(experienceSchema).refine(
    (experience) => {
      const combinations = experience.map(
        (item) => `${item.company}|${item.position}`
      );
      return uniqueValidator(combinations);
    },
    {
      message: "Company and Position combinations must be unique.",
    }
  ),
});

export default function ProfileForm({ user }) {
  const [loading, setLoading] = useState(false);
  const { setUser } = useStore();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      pic: user.pic || "",
      about: user.about || "",
      achievements: user.achievements || "",
      skills: user.skills || [],
      profiles: Object.keys(profiles).reduce((acc, p) => {
        if (user.profiles?.[p]) acc[p] = user.profiles[p];
        return acc;
      }, {}),
      projects:
        user.projects?.map((project) => ({
          name: project.name,
          live_url: project.live_url,
          code_url: project.code_url,
          skills: project.skills,
          about: project.about,
        })) || [],
      education:
        user.education?.map((edu) => ({
          college: edu.college,
          degree: edu.degree,
          score: edu.score || "",
          specialization: edu.specialization || "",
          start: edu.start,
          end: edu.end,
        })) || [],
      experience:
        user.experience?.map((exp) => ({
          company: exp.company,
          position: exp.position,
          start: exp.start,
          end: exp.end || "",
          about: exp.about,
        })) || [],
    },
  });

  const { control, handleSubmit, watch, setValue, formState } = form;
  const {
    fields: skillsFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: "skills",
  });
  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({
    control,
    name: "projects",
  });
  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  });
  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "experience",
  });

  const skills = watch("skills");

  const onSubmit = async (formdata) => {
    // Handle form submission
    try {
      setLoading(true);
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const data = await response.json();

      if (data.user) {
        setUser(data.user);
        router.push(`/users/${data.user.username}`);
        toast.success("User updated successfully");
      } else throw new Error(data.error);
    } catch (error) {
      console.log("Error submitting form:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Extract the error keys
    const errorKeys = Object.keys(formState.errors);

    // Iterate through error keys
    for (const key of errorKeys) {
      const error = formState.errors[key];

      // Check if the error message exists
      if (error?.root?.message) {
        toast.error(error.root.message);
        break; // Show only the first error and stop
      }
    }
  }, [formState.errors]);

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl -mb-10"
      >
        <BasicInfoSection control={control} user={user} />
        <Separator />

        <AchievementsSection control={control} />
        <Separator />

        <ProfilesSection control={control} />
        <Separator />

        <SkillsSection
          skills={skills}
          removeSkill={removeSkill}
          appendSkill={appendSkill}
          setValue={setValue}
        />
        <Separator />

        <ExperienceSection
          experienceFields={experienceFields}
          appendExperience={appendExperience}
          removeExperience={removeExperience}
          control={control}
        />
        <Separator />

        <ProjectsSection
          projectFields={projectFields}
          appendProject={appendProject}
          removeProject={removeProject}
          skills={skills}
          control={control}
        />
        <Separator />

        <EducationSection
          educationFields={educationFields}
          appendEducation={appendEducation}
          removeEducation={removeEducation}
          control={control}
        />
        <Separator />

        <Button
          type="submit"
          disabled={loading}
          className={`w-full font-bold my-10 ${
            loading && "cursor-not-allowed"
          }`}
        >
          {loading ? (
            <>
              Loading <Spinner className="size-4 ml-2" />
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
}

function BasicInfoSection({ control, user }) {
  return (
    <div>
      <FormLabel className="text-2xl">Basic Info</FormLabel>
      <div className="flex flex-col-reverse sm:grid sm:grid-cols-2 gap-6 my-6">
        <div className="flex flex-col gap-6">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="about"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About</FormLabel>
                <FormControl>
                  <Textarea
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.preventDefault();
                    }}
                    {...field}
                    className="sm:h-[6.13rem] resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={control}
          name="pic"
          render={({ field }) => (
            <FormItem>
              <div>
                <Image
                  src={
                    !field.value ? "/images/default_user_pic.png" : field.value
                  }
                  alt="Profile Picture"
                  width={250}
                  height={250}
                  className="rounded-full mx-auto"
                />
              </div>
              <FormLabel>Profile Pic</FormLabel>
              <FormControl>
                <div className="flex gap-x-2 items-center">
                  <Input {...field} />
                  <RotateCcw
                    className="cursor-pointer"
                    onClick={() =>
                      user.pic
                        ? field.onChange(user.pic)
                        : field.onChange("/images/default_user_pic.png")
                    }
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-6 my-10">
        <FormField
          control={control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function AchievementsSection({ control }) {
  return (
    <div className="my-10">
      <FormField
        control={control}
        name="achievements"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-2xl">Achievements</FormLabel>
            <FormControl>
              <Tiptap desc={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function ProfilesSection({ control }) {
  return (
    <div className="flex flex-col gap-6 my-10">
      <FormLabel className="text-2xl">Profiles</FormLabel>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 place-items-center gap-4">
        {Object.keys(profiles).map((profileName, index) => (
          <div key={profileName} className="flex items-center">
            <FormField
              control={control}
              name={`profiles.${profileName}`}
              render={({ field }) => (
                <FormItem
                  className={`flex justify-center items-center ${
                    !field.value && "opacity-50"
                  }`}
                >
                  <FormLabel>
                    <Link
                      href={
                        field.value
                          ? `${profiles[profileName].base_url}${field.value}`
                          : profiles[profileName].base_url
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={`/icons/Social/${profileName}.svg`}
                        width={30}
                        height={30}
                        alt={`${profileName} logo`}
                      />
                    </Link>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={`${profiles[profileName].name} Username`}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsSection({ skills, removeSkill, appendSkill, setValue }) {
  const [skillSearchQuery, setSkillSearchQuery] = useState("");

  const handleAddSkill = (skill) => {
    if (!skills.includes(skill)) {
      appendSkill(skill);
      setValue("skills", [...skills, skill]); // Update skills array
    }
  };
  return (
    <div className="flex flex-col gap-6 my-10">
      <FormLabel className="text-2xl">Skills</FormLabel>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="md:h-[333px] sm:min-w-[350px] w-full rounded-md border p-4 flex justify-center items-center overflow-auto">
          <div className="w-full">
            {skills.sort().map((item, index) => (
              <Badge
                key={item}
                variant="secondary"
                onClick={() => removeSkill(index)}
                className="cursor-pointer my-2 mx-3"
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
        </div>
        <ScrollArea className="h-[333px] sm:min-w-[350px] rounded-md border p-4 opacity-80 relative pt-[4.5rem]">
          <div className="p-4 absolute top-0 left-0 bg-background z-10 w-full">
            <Input
              placeholder="Search a skill to add..."
              value={skillSearchQuery}
              onChange={(e) => setSkillSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          {Object.entries(categorizedSkills).map(
            ([category, { skills: skillSet, title }], index) => {
              const filteredSkills = Object.entries(skillSet).filter(
                ([skill]) =>
                  !skills.includes(skill) && skill.includes(skillSearchQuery)
              );
              if (filteredSkills.length)
                return (
                  <div key={category} className="select-none">
                    <p className="text-sm mb-2">{title}</p>
                    {filteredSkills.map(([skill, { icon, url }]) => (
                      <div
                        key={skill}
                        className="text-sm px-2 ml-2 py-1.5 rounded-sm opacity-70 hover:bg-secondary flex gap-x-4 items-center cursor-pointer"
                        onClick={() => {
                          handleAddSkill(skill);
                        }}
                      >
                        <span>{skill}</span>
                      </div>
                    ))}
                    {index !== Object.entries(categorizedSkills).length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </div>
                );
            }
          )}
        </ScrollArea>
      </div>
    </div>
  );
}

function ExperienceSection({
  experienceFields,
  appendExperience,
  removeExperience,
  control,
}) {
  return (
    <div className="flex flex-col gap-6 my-10">
      <FormLabel className="text-2xl">Experience</FormLabel>
      {experienceFields.map((item, index) => (
        <div
          key={item.id}
          className="flex flex-col gap-4 bg-slate-900 rounded-md p-2 mb-2"
        >
          <div className="flex justify-between sm:gap-10">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <FormField
                control={control}
                name={`experience.${index}.company`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Company Name"
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
                        placeholder="Position"
                        className="font-semibold"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="button"
              onClick={() => removeExperience(index)}
              variant="ghost"
            >
              <Trash className="w-4 h-4" />
            </Button>
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
                      placeholder="Start Date (e.g., Nov 2024)"
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
                  <Textarea {...field} placeholder="Description" />
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
          appendExperience({
            company: "",
            position: "",
            start: "",
            end: "",
            about: "",
          })
        }
      >
        Add Experience
      </Button>
    </div>
  );
}

function ProjectsSection({
  projectFields,
  appendProject,
  removeProject,
  skills,
  control,
}) {
  return (
    <div className="flex flex-col gap-6 my-10">
      <FormLabel className="text-2xl">Projects</FormLabel>
      {projectFields.map((item, index) => (
        <div
          key={item.id}
          className="flex flex-col gap-4 bg-slate-900 rounded-md p-2 mb-2"
        >
          <div className="flex justify-between">
            <FormField
              control={control}
              name={`projects.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Project Name"
                      className="text-[17px] font-semibold"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              onClick={() => removeProject(index)}
              variant="ghost"
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <FormField
              control={control}
              name={`projects.${index}.code_url`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input {...field} placeholder="Github Link" />
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
                    placeholder="Project Description"
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
          appendProject({
            name: "",
            live_url: "",
            code_url: "",
            skills: [""],
            about: "",
          })
        }
      >
        Add Project
      </Button>
    </div>
  );
}

function ProjectSkillsComponent({ skills, field }) {
  useEffect(() => {
    const initialSkills = field.value.filter((skill) => skill.trim()) || [];
    if (
      initialSkills.length !== field.value.length ||
      !initialSkills.every((value, idx) => value === field.value[idx])
    ) {
      field.onChange(initialSkills);
    }
  }, [field]);

  const handleSkillClick = (item) => {
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
      <div className="w-full bg-background rounded-md py-2">
        {field.value.sort().map((item) => (
          <Badge
            key={item}
            variant={field.value.includes(item) ? "secondary" : "ghost"}
            onClick={() => handleSkillClick(item)}
            className="cursor-pointer my-2 mx-3"
          >
            {item}
          </Badge>
        ))}
        {skills
          .sort()
          .filter((item) => !field.value.includes(item))
          .map((item) => (
            <Badge
              key={item}
              variant="ghost"
              onClick={() => handleSkillClick(item)}
              className="cursor-pointer my-2 mx-3"
            >
              {item}
            </Badge>
          ))}
        {!skills.length && (
          <div className="w-full text-center opacity-50">
            No Skills Selected
          </div>
        )}
      </div>
    </div>
  );
}

function EducationSection({
  educationFields,
  appendEducation,
  removeEducation,
  control,
}) {
  return (
    <div className="flex flex-col gap-6 my-10">
      <FormLabel className="text-2xl">Education</FormLabel>
      {educationFields.map((item, index) => (
        <div
          key={item.id}
          className="flex flex-col gap-4 bg-slate-900 rounded-md p-2 mb-2"
        >
          <div className="flex justify-between gap-10">
            <FormField
              control={control}
              name={`education.${index}.degree`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Degree"
                      className="text-[17px] font-semibold"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              onClick={() => removeEducation(index)}
              variant="ghost"
            >
              <Trash className="w-4 h-4" />
            </Button>
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
            name={`education.${index}.college`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="College Name" />
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
                      placeholder="Start Date (e.g., Nov 2020)"
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
          appendEducation({
            college: "",
            degree: "",
            specialization: "",
            start: "",
            end: "",
          })
        }
      >
        Add Education
      </Button>
    </div>
  );
}
