"use client";

import { buildResumePdfFilename } from "@/features/tailoring/pdf/build-resume-filename";
import { PDF_RATE_LIMIT_MESSAGE } from "@/features/tailoring/pdf/pdf-rate-limit";
import type { OptimizedResume } from "@/features/tailoring/lib/types";
import type { TemplateId } from "@/templates/registry";

export async function downloadOptimizedResumePdf(
  resume: OptimizedResume,
  filename?: string,
  templateId: TemplateId = "minimal",
): Promise<void> {
  const response = await fetch("/api/resume-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume, templateId }, (_key, value: unknown) => (value === undefined ? null : value)),
  });

  if (response.status === 429) {
    throw new Error(PDF_RATE_LIMIT_MESSAGE);
  }
  if (!response.ok) {
    throw new Error("Your PDF could not be created. Please try again.");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  try {
    link.href = url;
    link.download = filename ?? buildResumePdfFilename(resume);
    document.body.appendChild(link);
    link.click();
  } finally {
    link.remove();
    URL.revokeObjectURL(url);
  }
}
