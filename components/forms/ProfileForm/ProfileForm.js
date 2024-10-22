"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { formSchema } from "./schemas/formSchema";
import BasicInfoSection from "./sections/BasicInfoSection";
import AchievementsSection from "./sections/AchievementsSection";
import ProfilesSection from "./sections/ProfilesSection";
import SkillsSection from "./sections/SkillsSection";
import ExperienceSection from "./sections/ExperienceSection";
import ProjectsSection from "./sections/ProjectsSection";
import EducationSection from "./sections/EducationSection";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { profiles, categorizedSkills, default_user_pic } from "@/constants";
import { useEffect, useState } from "react";
import useStore from "@/stores/useStore";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import { isSameObject, resolveUrl } from "@/utils";

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
      pic: resolveUrl(user.pic, default_user_pic),
      about: user.about || "",
      achievements: user.achievements || "",
      skills: user.skills || [],
      profiles: Object.keys(profiles).reduce((acc, p) => {
        if (user.profiles?.[p]) acc[p] = user.profiles[p];
        return acc;
      }, {}),
      projects:
        user.projects?.map((project) => ({
          order: project.order,
          name: project.name,
          live_url: project.live_url,
          code_url: project.code_url,
          skills: project.skills,
          about: project.about,
        })) || [],
      education:
        user.education?.map((edu) => ({
          order: edu.order,
          institution: edu.institution,
          degree: edu.degree,
          score: edu.score || "",
          specialization: edu.specialization || "",
          start: edu.start,
          end: edu.end,
        })) || [],
      experience:
        user.experience?.map((exp) => ({
          order: exp.order,
          company: exp.company,
          position: exp.position,
          start: exp.start,
          end: exp.end || "",
          about: exp.about,
        })) || [],
    },
  });

  const { control, handleSubmit, watch, setValue, formState } = form;
  const { append: appendSkill, remove: removeSkill } = useFieldArray({
    control,
    name: "skills",
  });
  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
    update: updateExperience,
  } = useFieldArray({
    control,
    name: "experience",
  });
  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
    update: updateProject,
  } = useFieldArray({
    control,
    name: "projects",
  });
  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
    update: updateEducation,
  } = useFieldArray({
    control,
    name: "education",
  });
  const skills = watch("skills");

  const moveItem = (watchFunc, updateFunc, index, direction) => {
    const fields = watchFunc(); // get current values from the form state
    if (
      (direction === "up" && index <= 0) ||
      (direction === "down" && index >= fields.length - 1)
    )
      return;

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    const currentItem = fields[index];
    const swapItem = fields[swapIndex];
    updateFunc(swapIndex, currentItem);
    updateFunc(index, swapItem);
  };
  const moveExperience = (index, direction) => {
    moveItem(() => watch("experience"), updateExperience, index, direction);
  };
  const moveProject = (index, direction) => {
    moveItem(() => watch("projects"), updateProject, index, direction);
  };
  const moveEducation = (index, direction) => {
    moveItem(() => watch("education"), updateEducation, index, direction);
  };

  const onSubmit = async (formdata) => {
    // Handle form submission
    if (isSameObject(formdata, form.control._defaultValues))
      return toast.info("No changes detected. Nothing to update.");
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

  const handleKeyDown = (e) => {
    const skipTags = ["INPUT", "DIV"]; // Enter key behavior is naturally prevented for textarea elements
    if (e.key === "Enter" && skipTags.includes(e.target.tagName))
      e.preventDefault();
  };

  function handleErrors(errors) {
    // unique identifier error in experience, projects, education
    for (const key of Object.keys(errors)) {
      if (errors[key]?.root?.message) {
        toast.error(errors[key].root.message);
        return;
      }
    }

    // at least 1 skill error in project
    if (!errors.projects || !errors.projects?.length) return;

    for (const key of errors.projects) {
      if (key?.skills?.message) {
        toast.error(key.skills.message);
        return;
      }
    }
  }

  useEffect(() => {
    handleErrors(formState.errors);
  }, [formState.errors]);

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={loading ? (e) => e.preventDefault() : handleKeyDown}
        className={`w-full max-w-3xl -mb-10 ${
          loading && "loading opacity-50"
        }`}
      >
        <BasicInfoSection user={user} control={control} />
        <Separator />

        <AchievementsSection control={control} />
        <Separator />

        <ProfilesSection control={control} />
        <Separator />

        <SkillsSection
          fields={skills}
          append={appendSkill}
          remove={removeSkill}
          setValue={setValue}
        />
        <Separator />

        <ExperienceSection
          fields={experienceFields}
          append={appendExperience}
          remove={removeExperience}
          move={moveExperience}
          control={control}
        />
        <Separator />

        <ProjectsSection
          skills={skills}
          fields={projectFields}
          append={appendProject}
          remove={removeProject}
          move={moveProject}
          control={control}
        />
        <Separator />

        <EducationSection
          fields={educationFields}
          append={appendEducation}
          remove={removeEducation}
          move={moveEducation}
          control={control}
        />
        <Separator />

        <Button
          type="submit"
          disabled={loading}
          className={`w-full font-bold my-10 ${loading && "loading"}`}
          aria-label="submit your details"
        >
          {loading ? (
            <>
              Saving <Spinner className="size-4 ml-2" />
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </Form>
  );
}
