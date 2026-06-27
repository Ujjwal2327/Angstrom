// components/forms/ProfileForm/ProfileForm.js
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
import FormSectionShell from "./shared/FormSectionShell";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { profiles, categorizedSkills, default_user_pic } from "@/constants";
import { useEffect, useState } from "react";
import useStore from "@/stores/useStore";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/Spinner";
import { isSameObject, resolveUrl } from "@/utils";
import { CheckCircle } from "lucide-react";

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
        user.projects?.map((p) => ({
          order: p.order,
          name: p.name,
          live_url: p.live_url,
          code_url: p.code_url,
          skills: p.skills || [],
          about: p.about,
        })) || [],
      education:
        user.education?.map((e) => ({
          order: e.order,
          institution: e.institution,
          degree: e.degree,
          score: e.score || "",
          specialization: e.specialization || "",
          start: e.start,
          end: e.end,
        })) || [],
      experience:
        user.experience?.map((e) => ({
          order: e.order,
          company: e.company,
          position: e.position,
          start: e.start,
          end: e.end || "",
          about: e.about,
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
    move: moveExperience,
  } = useFieldArray({ control, name: "experience" });
  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
    move: moveProject,
  } = useFieldArray({ control, name: "projects" });
  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
    move: moveEducation,
  } = useFieldArray({ control, name: "education" });

  const skills = watch("skills");

  const onSubmit = async (formdata) => {
    if (isSameObject(formdata, form.control._defaultValues)) {
      toast.info("No changes to save.");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata),
      });
      const data = await response.json();
      if (data.user) {
        setUser(data.user);
        toast.success("Portfolio saved.", {
          icon: <CheckCircle className="text-success" size={16} />,
        });
        router.push(`/users/${data.user.username}`);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    const skipTags = ["INPUT", "DIV"];
    if (e.key === "Enter" && skipTags.includes(e.target.tagName))
      e.preventDefault();
  };

  function handleErrors(errors) {
    for (const key of Object.keys(errors)) {
      if (errors[key]?.root?.message) {
        toast.error(errors[key].root.message);
        return;
      }
    }
    if (!errors.projects?.length) return;
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
        className={`w-full ${loading ? "loading opacity-50 pointer-events-none" : ""}`}
      >
        <FormSectionShell index="01" title="basic info">
          <BasicInfoSection user={user} control={control} />
        </FormSectionShell>

        <FormSectionShell
          index="02"
          title="achievements"
          description="Awards, certifications, or milestones worth calling out."
        >
          <AchievementsSection control={control} />
        </FormSectionShell>

        <FormSectionShell
          index="03"
          title="profiles"
          description="Link your presence elsewhere — GitHub, LinkedIn, competitive programming, etc."
        >
          <ProfilesSection control={control} />
        </FormSectionShell>

        <FormSectionShell
          index="04"
          title="skills"
          description="Drag to reorder. Skills you place first appear largest on your public profile."
        >
          <SkillsSection
            fields={skills}
            append={appendSkill}
            remove={removeSkill}
            setValue={setValue}
          />
        </FormSectionShell>

        <FormSectionShell
          index="05"
          title="experience"
          description="Most recent or most relevant first gives the strongest read."
        >
          <ExperienceSection
            fields={experienceFields}
            append={appendExperience}
            remove={removeExperience}
            move={moveExperience}
            control={control}
          />
        </FormSectionShell>

        <FormSectionShell
          index="06"
          title="projects"
          description="Add a live link to get an automatic screenshot — otherwise we show your GitHub repo card."
        >
          <ProjectsSection
            skills={skills}
            fields={projectFields}
            append={appendProject}
            remove={removeProject}
            move={moveProject}
            control={control}
          />
        </FormSectionShell>

        <FormSectionShell index="07" title="education">
          <EducationSection
            fields={educationFields}
            append={appendEducation}
            remove={removeEducation}
            move={moveEducation}
            control={control}
          />
        </FormSectionShell>

        {/* Sticky save bar */}
        <div className="sticky bottom-0 z-20 bg-background/95 backdrop-blur border-t border-border -mx-5 sm:-mx-8 px-5 sm:px-8 py-4 mt-10">
          <Button
            type="submit"
            disabled={loading}
            className="w-full max-w-xs mx-auto flex rounded-none font-mono uppercase tracking-wide text-sm h-11"
            aria-label="Save your portfolio changes"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                saving <Spinner className="size-4" />
              </span>
            ) : (
              "save changes →"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
