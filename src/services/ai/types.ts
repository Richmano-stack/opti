import { z } from "zod";

export const MAX_RESUME_LENGTH = 50_000;
export const MAX_JOB_DESCRIPTION_LENGTH = 30_000;

const requiredText = (label: string, maxLength: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(maxLength, `${label} must be ${maxLength.toLocaleString()} characters or fewer`);

const optionalText = (maxLength: number) =>
  z
    .string()
    .trim()
    .min(1)
    .max(maxLength)
    .nullish()
    .transform((value) => value ?? undefined);

export const generationInputSchema = z
  .object({
    resume: requiredText("Resume text", MAX_RESUME_LENGTH),
    jobDescription: requiredText(
      "Job description text",
      MAX_JOB_DESCRIPTION_LENGTH,
    ),
  })
  .strict();

export const contactSchema = z
  .object({
    name: requiredText("Contact name", 200),
    email: z
      .string()
      .trim()
      .email("Contact email must be valid")
      .max(320)
      .nullish()
      .transform((value) => value ?? undefined),
    phone: optionalText(100),
    location: optionalText(200),
  })
  .strict();

export const experienceEntrySchema = z
  .object({
    company: requiredText("Company name", 200),
    title: requiredText("Job title", 200),
    dates: requiredText("Employment dates", 100),
    bullets: z
      .array(requiredText("Experience bullet", 500))
      .min(1, "At least one bullet is required")
      .max(15, "Experience entries cannot contain more than 15 bullets"),
  })
  .strict();

export const educationEntrySchema = z
  .object({
    institution: requiredText("Institution name", 200),
    degree: requiredText("Degree", 200),
    dates: optionalText(100),
  })
  .strict();

export const optimizedResumeSchema = z
  .object({
    contact: contactSchema,
    summary: requiredText("Professional summary", 2_000),
    skills: z
      .array(requiredText("Skill", 100))
      .min(1, "At least one skill is required")
      .max(50, "A resume cannot contain more than 50 skills"),
    experience: z
      .array(experienceEntrySchema)
      .min(1, "At least one experience entry is required")
      .max(30, "A resume cannot contain more than 30 experience entries"),
    education: z
      .array(educationEntrySchema)
      .min(1, "At least one education entry is required")
      .max(10, "A resume cannot contain more than 10 education entries"),
  })
  .strict();

export type Contact = z.infer<typeof contactSchema>;
export type ExperienceEntry = z.infer<typeof experienceEntrySchema>;
export type EducationEntry = z.infer<typeof educationEntrySchema>;
export type OptimizedResume = z.infer<typeof optimizedResumeSchema>;
export type OptimizeResumeInput = z.infer<typeof generationInputSchema>;
