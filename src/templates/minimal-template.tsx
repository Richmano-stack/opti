import { EducationItem } from "@/templates/common/education-item";
import { ExperienceItem } from "@/templates/common/experience-item";
import { HeaderSection } from "@/templates/common/header-section";
import { ResumeSection } from "@/templates/common/resume-section";
import { SkillsSection } from "@/templates/common/skills-section";
import { themeStyle } from "@/templates/theme";
import type { ResumeData } from "@/templates/types";

function hasText(value: string | undefined): value is string {
  return Boolean(value && value.trim().length > 0);
}

export function MinimalTemplate({ resume }: { resume: ResumeData }) {
  const projects = resume.projects?.filter((project) => hasText(project.name)) ?? [];
  const certifications = resume.certifications?.filter((item) => hasText(item.name)) ?? [];
  const links = [
    resume.contact.linkedin ? { label: "LinkedIn", href: resume.contact.linkedin } : undefined,
    resume.contact.portfolio ? { label: "Portfolio", href: resume.contact.portfolio } : undefined,
  ].filter((link): link is { label: string; href: string } => Boolean(link));

  return (
    <article
      style={themeStyle("compact")}
      className="border border-neutral-200 px-[var(--resume-margin)] py-8 shadow-sm"
      aria-label={`${resume.contact.name} résumé`}
    >
      <HeaderSection
        name={resume.contact.name}
        headline={resume.headline}
        email={resume.contact.email}
        phone={resume.contact.phone}
        location={resume.contact.location}
        links={links}
      />
      <div className="mt-[var(--resume-section)]">
        {hasText(resume.summary) ? (
          <ResumeSection title="Summary" divided>
            <p className="text-[13px] leading-5">{resume.summary}</p>
          </ResumeSection>
        ) : null}
        <ResumeSection title="Experience" divided>
          {resume.experience.map((entry) => (
            <ExperienceItem
              key={`${entry.company}-${entry.title}-${entry.dates}`}
              title={entry.title}
              organization={entry.company}
              dates={entry.dates}
              bullets={entry.bullets}
            />
          ))}
        </ResumeSection>
        {resume.skills.length > 0 ? (
          <ResumeSection title="Skills" divided>
            <SkillsSection skills={resume.skills} variant="inline" />
          </ResumeSection>
        ) : null}
        {resume.education.length > 0 ? (
          <ResumeSection title="Education" divided>
            {resume.education.map((entry) => (
              <EducationItem
                key={`${entry.institution}-${entry.degree}`}
                title={entry.degree}
                meta={entry.institution}
                dates={entry.dates}
              />
            ))}
          </ResumeSection>
        ) : null}
        {certifications.length > 0 ? (
          <ResumeSection title="Certifications" divided>
            {certifications.map((item) => (
              <EducationItem key={`${item.name}-${item.issuer ?? ""}`} title={item.name} meta={item.issuer} dates={item.dates} />
            ))}
          </ResumeSection>
        ) : null}
        {projects.length > 0 ? (
          <ResumeSection title="Projects" divided>
            {projects.map((project) => (
              <ExperienceItem key={`${project.name}-${project.dates ?? ""}`} title={project.name} dates={project.dates} bullets={project.bullets} />
            ))}
          </ResumeSection>
        ) : null}
      </div>
    </article>
  );
}
