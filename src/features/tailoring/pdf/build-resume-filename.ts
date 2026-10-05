import type { OptimizedResume } from "@/features/tailoring/lib/types";

export function buildResumePdfFilename(resume: OptimizedResume): string {
  const sanitizedName = resume.contact.name
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

  const baseName = sanitizedName.length > 0 ? sanitizedName : "Resume";
  return `${baseName}_Resume.pdf`;
}
