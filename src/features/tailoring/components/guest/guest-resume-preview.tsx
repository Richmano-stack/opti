import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { OptimizedResume } from "@/features/tailoring/lib/types";

function hasEntries<T>(entries: T[] | undefined): entries is T[] {
  return Boolean(entries && entries.length > 0);
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="mt-5" aria-labelledby={id}>
      <h3
        id={id}
        className="border-b border-[#1c1c1c] pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1c1c1c]"
      >
        {title}
      </h3>
      <div className="mt-2.5">{children}</div>
    </section>
  );
}

function DatedRow({ title, meta, aside }: { title: string; meta?: string; aside?: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <h4 className="text-sm font-semibold text-[#1c1c1c]">{title}</h4>
        {aside ? <span className="shrink-0 text-xs text-[#5f5f5f]">{aside}</span> : null}
      </div>
      {meta ? <p className="text-sm text-[#5f5f5f]">{meta}</p> : null}
    </div>
  );
}

export function GuestResumePreview({
  resume,
  className,
}: {
  resume: OptimizedResume;
  className?: string;
}) {
  const contact = [
    resume.contact.email,
    resume.contact.phone,
    resume.contact.location,
    resume.contact.linkedin,
    resume.contact.portfolio,
  ]
    .filter(Boolean)
    .join(" · ");
  const headline = resume.headline ?? resume.experience[0]?.title;

  return (
    <article className={cn("mx-auto w-full max-w-[816px] border border-neutral-200 bg-white px-8 py-10 text-left text-[#1c1c1c] shadow-sm sm:px-14 sm:py-12", className)}>
      <header className="text-center">
        <h2 className="text-[1.75rem] font-semibold tracking-[-0.02em]">{resume.contact.name}</h2>
        {headline ? <p className="mt-1 text-sm text-[#3a3a3a]">{headline}</p> : null}
        {contact ? <p className="mt-2 text-xs leading-5 text-[#5f5f5f]">{contact}</p> : null}
      </header>

      <Section id="preview-summary" title="Professional summary">
        <p className="text-sm leading-6">{resume.summary}</p>
      </Section>

      <Section id="preview-experience" title="Experience">
        <div className="space-y-4">
          {resume.experience.map((entry) => (
            <div key={`${entry.company}-${entry.title}-${entry.dates}`}>
              <DatedRow title={entry.title} meta={entry.company} aside={entry.dates} />
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm leading-6">
                {entry.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {hasEntries(resume.skills) ? (
        <Section id="preview-skills" title="Skills">
          <p className="text-sm leading-6">{resume.skills.join(" · ")}</p>
        </Section>
      ) : null}

      {hasEntries(resume.education) ? (
        <Section id="preview-education" title="Education">
          <div className="space-y-3">
            {resume.education.map((entry) => (
              <DatedRow
                key={`${entry.institution}-${entry.degree}`}
                title={entry.degree}
                meta={entry.institution}
                aside={entry.dates}
              />
            ))}
          </div>
        </Section>
      ) : null}

      {hasEntries(resume.certifications) ? (
        <Section id="preview-certifications" title="Certifications">
          <div className="space-y-3">
            {resume.certifications.map((entry) => (
              <DatedRow
                key={`${entry.name}-${entry.issuer ?? ""}-${entry.dates ?? ""}`}
                title={entry.name}
                meta={entry.issuer}
                aside={entry.dates}
              />
            ))}
          </div>
        </Section>
      ) : null}

      {hasEntries(resume.projects) ? (
        <Section id="preview-projects" title="Projects">
          <div className="space-y-4">
            {resume.projects.map((entry) => (
              <div key={`${entry.name}-${entry.dates ?? ""}`}>
                <DatedRow title={entry.name} aside={entry.dates} />
                <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm leading-6">
                  {entry.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      ) : null}
    </article>
  );
}
