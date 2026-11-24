import type { OptimizedResume } from "@/features/tailoring/lib/types";

export function formatResumeText(resume: OptimizedResume): string {
  const sections: string[] = [];
  const contact = [
    resume.contact.email,
    resume.contact.phone,
    resume.contact.location,
    resume.contact.linkedin,
    resume.contact.portfolio,
  ].filter((value): value is string => Boolean(value?.trim()));

  sections.push([resume.contact.name, ...contact].join("\n"));
  if (resume.headline?.trim()) sections.push(resume.headline.trim());
  if (resume.summary.trim()) sections.push(`PROFESSIONAL SUMMARY\n${resume.summary.trim()}`);
  if (resume.skills.length) sections.push(`SKILLS\n${resume.skills.join(", ")}`);
  if (resume.experience.length) {
    const entries = resume.experience.map((entry) => {
      const header = [entry.title, entry.company].filter(Boolean).join(" - ");
      const dates = entry.dates ? ` (${entry.dates})` : "";
      return `${header}${dates}\n${entry.bullets.map((bullet) => `• ${bullet}`).join("\n")}`;
    });
    sections.push(`EXPERIENCE\n${entries.join("\n\n")}`);
  }
  if (resume.education.length) {
    sections.push(`EDUCATION\n${resume.education.map((entry) => {
      const header = [entry.degree, entry.institution].filter(Boolean).join(" - ");
      return `${header}${entry.dates ? ` (${entry.dates})` : ""}`;
    }).join("\n")}`);
  }
  if (resume.certifications?.length) {
    sections.push(`CERTIFICATIONS\n${resume.certifications.map((item) =>
      [item.name, item.issuer, item.dates].filter(Boolean).join(" - "),
    ).join("\n")}`);
  }
  if (resume.projects?.length) {
    sections.push(`PROJECTS\n${resume.projects.map((project) =>
      `${project.name}${project.dates ? ` (${project.dates})` : ""}\n${project.bullets.map((bullet) => `• ${bullet}`).join("\n")}`,
    ).join("\n\n")}`);
  }
  return sections.join("\n\n");
}
