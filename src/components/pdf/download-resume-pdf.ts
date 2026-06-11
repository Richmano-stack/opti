"use client";

import { pdf } from "@react-pdf/renderer";
import type { OptimizedResume } from "@/services/ai/types";
import { buildResumePdfFilename } from "@/components/pdf/build-resume-filename";
import { createResumePdfDocument } from "@/components/pdf/resume-pdf-document";

export async function downloadOptimizedResumePdf(
  resume: OptimizedResume,
  filename?: string
): Promise<void> {
  const blob = await pdf(createResumePdfDocument(resume)).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename ?? buildResumePdfFilename(resume);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
