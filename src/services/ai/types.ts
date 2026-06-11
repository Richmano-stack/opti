import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Contact name is required"),
  email: z.string().email().optional(),
  phone: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
});

export const experienceEntrySchema = z.object({
  company: z.string().min(1, "Company name is required"),
  title: z.string().min(1, "Job title is required"),
  dates: z.string().min(1, "Employment dates are required"),
  bullets: z.array(z.string().min(1)).min(1, "At least one bullet is required"),
});

export const educationEntrySchema = z.object({
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  dates: z.string().min(1).optional(),
});

export const optimizedResumeSchema = z.object({
  contact: contactSchema,
  summary: z.string().min(1, "Professional summary is required"),
  skills: z.array(z.string().min(1)).min(1, "At least one skill is required"),
  experience: z.array(experienceEntrySchema).min(1, "At least one experience entry is required"),
  education: z.array(educationEntrySchema).min(1, "At least one education entry is required"),
});

export type Contact = z.infer<typeof contactSchema>;
export type ExperienceEntry = z.infer<typeof experienceEntrySchema>;
export type EducationEntry = z.infer<typeof educationEntrySchema>;
export type OptimizedResume = z.infer<typeof optimizedResumeSchema>;

export type OptimizeResumeInput = {
  resume: string;
  jobDescription: string;
};
