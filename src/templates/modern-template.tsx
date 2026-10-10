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

function linksFor(resume: ResumeData) {
  return [
    resume.contact.linkedin ? { label: "LinkedIn", href: resume.contact.linkedin } : undefined,
    resume.contact.portfolio ? { label: "Portfolio", href: resume.contact.portfolio } : undefined,
  ].filter((link): link is { label: string; href: string } => Boolean(link));
}

export function ModernTemplate({ resume }: { resume: ResumeData }) {
  const projects = resume.projects?.filter((project) => hasText(project.name)) ?? [];
  const certifications = resume.certifications?.filter((item) => hasText(item.name)) ?? [];

  return (
    <article style={themeStyle("regular")} className="border border-neutral-200 shadow-sm" aria-label={`${resume.contact.name} résumé`}>
      <div className="bg-[var(--resume-accent)] px-[var(--resume-margin)] py-8">
        <HeaderSection
          tone="accent"
          name={resume.contact.name}
          headline={resume.headline ?? resume.experience[0]?.title}
          email={resume.contact.email}
          phone={resume.contact.phone}
          location={resume.contact.location}
          links={linksFor(resume)}
        />
      </div>
      <div className="grid gap-8 px-[var(--resume-margin)] py-8 @min-[768px]/resume:grid-cols-[minmax(0,1fr)_13rem]">
        <div>
          {hasText(resume.summary) ? (
            <ResumeSection title="Summary">
              <p className="text-sm leading-6">{resume.summary}</p>
            </ResumeSection>
          ) : null}
          <ResumeSection title="Experience">
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
          {projects.length > 0 ? (
            <ResumeSection title="Projects">
              {projects.map((project) => (
                <ExperienceItem
                  key={`${project.name}-${project.dates ?? ""}`}
                  title={project.name}
                  dates={project.dates}
                  bullets={project.bullets}
                />
              ))}
            </ResumeSection>
          ) : null}
        </div>
        <aside>
          <ResumeSection title="Skills">
            <SkillsSection skills={resume.skills} variant="pills" />
          </ResumeSection>
          {resume.education.length > 0 ? (
            <ResumeSection title="Education">
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
            <ResumeSection title="Certifications">
              {certifications.map((item) => (
                <EducationItem
                  key={`${item.name}-${item.issuer ?? ""}`}
                  title={item.name}
                  meta={item.issuer}
                  dates={item.dates}
                />
              ))}
            </ResumeSection>
          ) : null}
        </aside>
      </div>
    </article>
  );
}
