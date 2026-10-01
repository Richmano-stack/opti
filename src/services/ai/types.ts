import { z } from "zod";

export const MAX_RESUME_LENGTH = 50_000;
export const MAX_JOB_DESCRIPTION_LENGTH = 30_000;

const requiredText = (label: string, maxLength: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(maxLength, `${label} must be ${maxLength.toLocaleString()} characters or fewer`);

const bulletText = (label: string) =>
  requiredText(label, 500).transform((value) =>
    /[.!?]$/.test(value) ? value : `${value.replace(/[,;:]+$/, "")}.`,
  );

const optionalText = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength)
    .nullish()
    .transform((value) => value || undefined);

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
      .max(320)
      .nullish()
      .transform((value, context) => {
        if (!value) return undefined;
        const parsed = z.email().safeParse(value);
        if (!parsed.success) {
          context.addIssue({ code: "custom", message: "Contact email must be valid" });
          return z.NEVER;
        }
        return value;
      }),
    phone: optionalText(100),
    location: optionalText(200),
    linkedin: optionalText(500).optional(),
    portfolio: optionalText(500).optional(),
  })
  .strict();

export const experienceEntrySchema = z
  .object({
    company: requiredText("Company name", 200),
    title: requiredText("Job title", 200),
    dates: requiredText("Employment dates", 100),
    bullets: z
      .array(bulletText("Experience bullet"))
      .min(1, "At least one bullet is required")
      .max(6, "Experience entries cannot contain more than 6 bullets"),
  })
  .strict();

export const educationEntrySchema = z
  .object({
    institution: requiredText("Institution name", 200),
    degree: requiredText("Degree", 200),
    dates: optionalText(100),
  })
  .strict();

export const certificationSchema = z
  .object({
    name: requiredText("Certification", 200),
    issuer: optionalText(200),
    dates: optionalText(100),
  })
  .strict();

export const projectSchema = z
  .object({
    name: requiredText("Project name", 200),
    dates: optionalText(100),
    bullets: z
      .array(bulletText("Project bullet"))
      .min(1, "At least one project bullet is required")
      .max(4, "Projects cannot contain more than 4 bullets"),
  })
  .strict();

export const matchNoteSchema = z
  .object({
    strengths: requiredText("Core strengths", 400),
    gaps: requiredText("Potential gaps", 400),
  })
  .strict();

export const optimizedResumeSchema = z
  .object({
    contact: contactSchema,
    headline: optionalText(120).optional(),
    summary: requiredText("Professional summary", 2_000),
    skills: z
      .array(requiredText("Skill", 100))
      .min(1, "At least one skill is required")
      .max(12, "A resume cannot contain more than 12 skills"),
    experience: z
      .array(experienceEntrySchema)
      .min(1, "At least one experience entry is required")
      .max(30, "A resume cannot contain more than 30 experience entries"),
    education: z
      .array(educationEntrySchema)
      .max(10, "A resume cannot contain more than 10 education entries"),
    certifications: z
      .array(certificationSchema)
      .max(8, "A resume cannot contain more than 8 certifications")
      .optional(),
    projects: z
      .array(projectSchema)
      .max(6, "A resume cannot contain more than 6 projects")
      .optional(),
    matchNote: matchNoteSchema
      .nullish()
      .transform((value) => value ?? undefined)
      .optional(),
  })
  .strict();

export type Contact = z.infer<typeof contactSchema>;
export type ExperienceEntry = z.infer<typeof experienceEntrySchema>;
export type EducationEntry = z.infer<typeof educationEntrySchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type Project = z.infer<typeof projectSchema>;
export type MatchNote = z.infer<typeof matchNoteSchema>;
export type OptimizedResume = z.infer<typeof optimizedResumeSchema>;
export type OptimizeResumeInput = z.infer<typeof generationInputSchema>;
