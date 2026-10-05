import { z } from "zod";

export const devSampleInputSchema = z
  .object({
    resume: z.string().trim().min(1),
    jobDescription: z.string().trim().min(1),
  })
  .strict();

export type DevSampleInput = z.infer<typeof devSampleInputSchema>;

export function isDevelopmentRuntime(env = process.env.NODE_ENV): boolean {
  return env === "development";
}
