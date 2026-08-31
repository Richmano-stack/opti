import type { OptimizedResume } from "@/services/ai/types";

export function GuestResumePreview({ resume }: { resume: OptimizedResume }) {
  const contact = [resume.contact.email, resume.contact.phone, resume.contact.location]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="mx-auto w-full max-w-[760px] bg-white px-6 py-8 text-slate-900 shadow-sm sm:px-10 sm:py-12">
      <header className="border-b border-slate-200 pb-5 text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {resume.contact.name}
        </h2>
        {contact ? <p className="mt-2 text-sm text-slate-600">{contact}</p> : null}
      </header>

      <section className="mt-6" aria-labelledby="preview-summary">
        <h3 id="preview-summary" className="text-xs font-bold uppercase tracking-[0.16em] text-brand-ink">
          Professional summary
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-700">{resume.summary}</p>
      </section>

      <section className="mt-6" aria-labelledby="preview-skills">
        <h3 id="preview-skills" className="text-xs font-bold uppercase tracking-[0.16em] text-brand-ink">
          Skills
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-700">{resume.skills.join(" · ")}</p>
      </section>

      <section className="mt-6" aria-labelledby="preview-experience">
        <h3 id="preview-experience" className="text-xs font-bold uppercase tracking-[0.16em] text-brand-ink">
          Experience
        </h3>
        <div className="mt-3 space-y-5">
          {resume.experience.map((entry) => (
            <div key={`${entry.company}-${entry.title}-${entry.dates}`}>
              <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                <h4 className="font-semibold text-slate-900">{entry.title}</h4>
                <span className="text-xs text-slate-500">{entry.dates}</span>
              </div>
              <p className="text-sm font-medium text-slate-600">{entry.company}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
                {entry.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6" aria-labelledby="preview-education">
        <h3 id="preview-education" className="text-xs font-bold uppercase tracking-[0.16em] text-brand-ink">
          Education
        </h3>
        <div className="mt-3 space-y-3">
          {resume.education.map((entry) => (
            <div key={`${entry.institution}-${entry.degree}`}>
              <p className="font-semibold text-slate-900">{entry.degree}</p>
              <p className="text-sm text-slate-600">
                {entry.institution}{entry.dates ? ` · ${entry.dates}` : ""}
              </p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}