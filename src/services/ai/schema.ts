import { SchemaType, type ResponseSchema } from "@google/generative-ai";

/**
 * Gemini Structured JSON Output schema for ATS-optimized resume payloads.
 * Enforced on every generateContent call via generationConfig.responseSchema.
 */
export const optimizedResumeGeminiSchema: ResponseSchema = {
  type: SchemaType.OBJECT,
  description: "ATS-optimized resume structured for single-column PDF rendering",
  properties: {
    contact: {
      type: SchemaType.OBJECT,
      description: "Candidate contact information",
      properties: {
        name: { type: SchemaType.STRING, description: "Full name" },
        email: { type: SchemaType.STRING, description: "Email address", nullable: true },
        phone: { type: SchemaType.STRING, description: "Phone number", nullable: true },
        location: { type: SchemaType.STRING, description: "City, state, or region", nullable: true },
      },
      required: ["name"],
    },
    summary: {
      type: SchemaType.STRING,
      description: "Professional summary tailored to the target role",
    },
    skills: {
      type: SchemaType.ARRAY,
      description: "Hard skills, tools, and certifications aligned to the job description",
      items: { type: SchemaType.STRING },
    },
    experience: {
      type: SchemaType.ARRAY,
      description: "Work history with XYZ-formula bullet points",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          company: { type: SchemaType.STRING, description: "Employer name" },
          title: { type: SchemaType.STRING, description: "Job title held" },
          dates: { type: SchemaType.STRING, description: "Employment date range" },
          bullets: {
            type: SchemaType.ARRAY,
            description: "Impact-driven accomplishment bullets",
            items: { type: SchemaType.STRING },
          },
        },
        required: ["company", "title", "dates", "bullets"],
      },
    },
    education: {
      type: SchemaType.ARRAY,
      description: "Academic credentials",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          institution: { type: SchemaType.STRING, description: "School or university name" },
          degree: { type: SchemaType.STRING, description: "Degree or credential earned" },
          dates: { type: SchemaType.STRING, description: "Graduation or attendance dates", nullable: true },
        },
        required: ["institution", "degree"],
      },
    },
  },
  required: ["contact", "summary", "skills", "experience", "education"],
};
