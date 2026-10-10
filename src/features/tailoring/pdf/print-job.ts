import { randomBytes } from "node:crypto";

import type { OptimizedResume } from "@/features/tailoring/lib/types";
import type { TemplateId } from "@/templates/registry";

const PRINT_JOB_TTL_MS = 30_000;

type PrintJob = {
  resume: OptimizedResume;
  templateId: TemplateId;
  expiresAt: number;
};

const globalStore = globalThis as typeof globalThis & {
  __optiPrintJobs?: Map<string, PrintJob>;
};

const jobs = globalStore.__optiPrintJobs ?? new Map<string, PrintJob>();
globalStore.__optiPrintJobs = jobs;

export function createPrintJob(resume: OptimizedResume, templateId: TemplateId): string {
  const token = randomBytes(24).toString("base64url");
  jobs.set(token, { resume, templateId, expiresAt: Date.now() + PRINT_JOB_TTL_MS });
  return token;
}

export function readPrintJob(token: string): { resume: OptimizedResume; templateId: TemplateId } | undefined {
  const job = jobs.get(token);
  if (!job) return undefined;
  if (job.expiresAt <= Date.now()) {
    jobs.delete(token);
    return undefined;
  }
  return { resume: job.resume, templateId: job.templateId };
}

export function deletePrintJob(token: string): void {
  jobs.delete(token);
}
