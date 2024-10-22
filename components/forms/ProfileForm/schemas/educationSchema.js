import { z } from "zod";

export const educationSchema = z
  .object({
    order: z.number(),
    institution: z
      .string()
      .trim()
      .min(1, { message: "Institution name is required" }),
    degree: z.string().trim().min(1, { message: "Degree is required" }),
    specialization: z.string().trim().optional(),
    score: z.string().trim().optional(),
    start: z.string().trim().min(1, { message: "Start date is required" }),
    end: z.string().trim().optional(),
  })
  .transform((data) => ({
    ...data,
    end: data.end || "Present",
  }));
