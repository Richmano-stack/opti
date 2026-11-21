import type { OptimizedResume } from "@/services/ai/types";

/**
 * Formats an OptimizedResume into clean, human-readable plain text
 * suitable for pasting directly into job application forms or text editors.
 */
export function formatResumeText(resume: OptimizedResume): string {
  const sections: string[] = [];

  // Contact Header
  const contactLines: string[] = [resume.contact.name];
  const details = [
    resume.contact.email,
    resume.contact.phone,
    resume.contact.location,
    resume.contact.linkedin,
    resume.contact.portfolio,
  ].filter(Boolean);
  if (details.length > 0) {
    contactLines.push(details.join(" | "));
  }
  sections.push(contactLines.join("\n"));

  // Professional Summary
  if (resume.summary?.trim()) {
    sections.push(`PROFESSIONAL SUMMARY\n${resume.summary.trim()}`);
  }

  // Skills
  if (resume.skills?.length > 0) {
    sections.push(`SKILLS\n${resume.skills.join(", ")}`);
  }

  // Experience
  if (resume.experience?.length > 0) {
    const expText = resume.experience
      .map((entry) => {
        const header = `${entry.title} - ${entry.company} (${entry.dates})`;
        const bullets = entry.bullets.map((b) => `• ${b}`).join("\n");
        return `${header}\n${bullets}`;
      })
      .join("\n\n");
    sections.push(`EXPERIENCE\n${expText}`);
  }

  // Education
  if (resume.education?.length > 0) {
    const eduText = resume.education
      .map((entry) => {
        const dateStr = entry.dates ? ` (${entry.dates})` : "";
        return `${entry.degree} - ${entry.institution}${dateStr}`;
      })
      .join("\n");
    sections.push(`EDUCATION\n${eduText}`);
  }

  return sections.join("\n\n");
}
