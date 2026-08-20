import { z } from "zod";

export const projectSchema = z
  .object({
    order: z.number(),
    name: z.string().trim().min(1, { message: "Project name is required" }),
    code_url: z.string().trim().url({ message: "Invalid URL" }),
    live_url: z.string().trim().optional(),
    // Optional grouping label (e.g. "Client Work", "Independent") — see
    // components/profile/ProjectsGrid.js for how/when this turns into a
    // filter on the public profile.
    category: z
      .string()
      .trim()
      .max(30, "Category cannot exceed 30 characters")
      .optional(),
    skills: z
      .array(
        z
          .string()
          .trim()
          .min(1, "Skill must be at least 1 character")
          .max(30, "Skill cannot exceed 30 characters"),
      )
      .min(1, { message: "At least one skill is required for the project" }),
    about: z
      .string()
      .trim()
      .min(1, { message: "Project description is required" }),
  })
  .transform((data) => {
    const filteredSkills = (data.skills || []).filter(
      (skill) => skill.trim() !== "",
    );
    return {
      ...data,
      live_url: data.live_url || data.code_url,
      category: data.category || "",
      skills: filteredSkills,
    };
  });
