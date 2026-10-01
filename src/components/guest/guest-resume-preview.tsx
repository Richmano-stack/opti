import type { OptimizedResume } from "@/services/ai/types";

function hasEntries<T>(entries: T[] | undefined): entries is T[] {
  return Boolean(entries && entries.length > 0);
}

export function GuestResumePreview({ resume }: { resume: OptimizedResume }) {
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
    <article className="mx-auto w-full max-w-[760px] rounded-2xl border border-horizon-outline/10 bg-white px-6 py-8 text-horizon-ink shadow-[0_12px_40px_rgb(47_49_49/0.06)] sm:px-10 sm:py-12">
      <header className="border-b border-slate-200 pb-5 text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {resume.contact.name}
        </h2>
        {headline ? <p className="mt-1 text-sm font-semibold text-slate-700">{headline}</p> : null}
        {contact ? <p className="mt-2 text-sm text-slate-600">{contact}</p> : null}
      </header>

      <section className="mt-6" aria-labelledby="preview-summary">
        <h3 id="preview-summary" className="text-xs font-bold uppercase tracking-[0.16em] text-horizon-primary">
          Professional summary
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-700">{resume.summary}</p>
      </section>

      <section className="mt-6" aria-labelledby="preview-experience">
        <h3 id="preview-experience" className="text-xs font-bold uppercase tracking-[0.16em] text-horizon-primary">
          Experience
        </h3>
        <div className="mt-3 space-y-5">
          {resume.experience.map((entry) => (
            <div key={`${entry.company}-${entry.title}-${entry.dates}`}>
              <div className="flex items-baseline justify-between gap-4">
                <h4 className="font-semibold text-slate-900">{entry.title}</h4>
                <span className="shrink-0 text-xs text-slate-500">{entry.dates}</span>
              </div>
              <p className="text-sm text-slate-600">{entry.company}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
                {entry.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {hasEntries(resume.skills) ? (
        <section className="mt-6" aria-labelledby="preview-skills">
          <h3 id="preview-skills" className="text-xs font-bold uppercase tracking-[0.16em] text-horizon-primary">
            Skills
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">{resume.skills.join(" · ")}</p>
        </section>
      ) : null}

      {hasEntries(resume.education) ? (
        <section className="mt-6" aria-labelledby="preview-education">
          <h3 id="preview-education" className="text-xs font-bold uppercase tracking-[0.16em] text-horizon-primary">
            Education
          </h3>
          <div className="mt-3 space-y-3">
            {resume.education.map((entry) => (
              <div key={`${entry.institution}-${entry.degree}`}>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-semibold text-slate-900">{entry.degree}</p>
                  {entry.dates ? <span className="shrink-0 text-xs text-slate-500">{entry.dates}</span> : null}
                </div>
                <p className="text-sm text-slate-600">{entry.institution}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {hasEntries(resume.certifications) ? (
        <section className="mt-6" aria-labelledby="preview-certifications">
          <h3 id="preview-certifications" className="text-xs font-bold uppercase tracking-[0.16em] text-horizon-primary">
            Certifications
          </h3>
          <div className="mt-3 space-y-3">
            {resume.certifications.map((entry) => (
              <div key={`${entry.name}-${entry.issuer ?? ""}-${entry.dates ?? ""}`}>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-semibold text-slate-900">{entry.name}</p>
                  {entry.dates ? <span className="shrink-0 text-xs text-slate-500">{entry.dates}</span> : null}
                </div>
                {entry.issuer ? <p className="text-sm text-slate-600">{entry.issuer}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {hasEntries(resume.projects) ? (
        <section className="mt-6" aria-labelledby="preview-projects">
          <h3 id="preview-projects" className="text-xs font-bold uppercase tracking-[0.16em] text-horizon-primary">
            Projects
          </h3>
          <div className="mt-3 space-y-5">
            {resume.projects.map((entry) => (
              <div key={`${entry.name}-${entry.dates ?? ""}`}>
                <div className="flex items-baseline justify-between gap-4">
                  <h4 className="font-semibold text-slate-900">{entry.name}</h4>
                  {entry.dates ? <span className="shrink-0 text-xs text-slate-500">{entry.dates}</span> : null}
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
                  {entry.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
