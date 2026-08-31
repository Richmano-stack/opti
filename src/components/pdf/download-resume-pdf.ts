"use client";

import { pdf } from "@react-pdf/renderer";

import { buildResumePdfFilename } from "@/components/pdf/build-resume-filename";
import { createResumePdfDocument } from "@/components/pdf/resume-pdf-document";
import type { OptimizedResume } from "@/services/ai/types";

export async function downloadOptimizedResumePdf(
  resume: OptimizedResume,
  filename?: string,
): Promise<void> {
  const blob = await pdf(createResumePdfDocument(resume)).toBlob();
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
