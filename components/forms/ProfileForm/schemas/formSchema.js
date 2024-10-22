import { z } from "zod";
import { projectSchema } from "./projectSchema";
import { educationSchema } from "./educationSchema";
import { experienceSchema } from "./experienceSchema";
import { resolveUrl, uniqueValidator } from "@/utils";
import { default_user_pic } from "@/constants";

export const formSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email" }),
  username: z
    .string()
    .trim()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(15, { message: "Username must be at most 15 characters." })
    .refine((username) => !/\s/.test(username), {
      message: "Username must not contain spaces.",
    })
    .transform((username) => username.toLowerCase()),
  about: z.string().trim().optional(),
  pic: z
    .string()
    .trim()
    .optional()
    .transform((val) => resolveUrl(val, default_user_pic)),
  firstname: z.string().trim().optional(),
  lastname: z.string().trim().optional(),
  achievements: z
    .string()
    .trim()
    .optional()
    .transform((val) => {
      return val === "<p></p>" || val === "<h2></h2>" ? "" : val;
    }),
  profiles: z
    .record(z.string().trim(), z.string().trim().optional())
    .transform((profiles) => {
      return Object.fromEntries(
        Object.entries(profiles).filter(([key, value]) => value !== "")
      );
    }),
  skills: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Skill must be at least 1 character")
        .max(30, "Skill cannot exceed 30 characters")
    )
    .default([]),
  experience: z
    .array(experienceSchema)
    .refine(
      (experience) => {
        const combinations = experience.map(
          (item) => `${item.company}|${item.position}`
        );
        return uniqueValidator(combinations);
      },
      { message: "Company and Position combinations must be unique." }
    )
    .transform((experience) =>
      experience.map((exp, index) => ({
        ...exp,
        order: index,
      }))
    ),
  projects: z
    .array(projectSchema)
    .refine(
      (projects) => {
        const projectNames = projects.map((item) => item.name);
        return uniqueValidator(projectNames);
      },
      { message: "Project names must be unique." }
    )
    .transform((projects) =>
      projects.map((project, index) => ({
        ...project,
        order: index,
      }))
    ),
  education: z
    .array(educationSchema)
    .refine(
      (education) => {
        const degrees = education.map((item) => item.degree);
        return uniqueValidator(degrees);
      },
      { message: "Degrees must be unique." }
    )
    .transform((education) =>
      education.map((edu, index) => ({
        ...edu,
        order: index,
      }))
    ),
});
