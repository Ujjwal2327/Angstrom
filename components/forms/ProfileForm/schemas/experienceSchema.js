import { z } from "zod";

export const experienceSchema = z
  .object({
    order: z.number(),
    company: z.string().trim().min(1, { message: "Company name is required" }),
    position: z.string().trim().min(1, { message: "Position is required" }),
    start: z.string().trim().min(1, { message: "Start date is required" }),
    end: z.string().trim().optional(),
    about: z.string().trim().optional(),
  })
  .transform((data) => ({
    ...data,
    end: data.end || "Present",
  }));
