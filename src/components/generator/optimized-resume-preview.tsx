import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { OptimizedResume } from "@/services/ai/types";

type OptimizedResumePreviewProps = {
  resume: OptimizedResume;
};

export function OptimizedResumePreview({ resume }: OptimizedResumePreviewProps) {
  const { contact } = resume;
  const contactLine = [contact.email, contact.phone, contact.location]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="space-y-5 text-sm leading-relaxed">
      <header className="space-y-1 text-center">
        <h2 className="text-lg font-semibold tracking-tight">{contact.name}</h2>
        {contactLine ? (
          <p className="text-muted-foreground">{contactLine}</p>
        ) : null}
      </header>

      <Separator />

      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Professional Summary
        </h3>
        <p>{resume.summary}</p>
      </section>

      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Skills
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {resume.skills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Experience
        </h3>
        {resume.experience.map((entry) => (
          <div key={`${entry.company}-${entry.title}`} className="space-y-1.5">
            <div>
              <p className="font-medium">{entry.title}</p>
              <p className="text-muted-foreground">
                {entry.company} · {entry.dates}
              </p>
            </div>
            <ul className="list-disc space-y-1 pl-5">
              {entry.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Education
        </h3>
        {resume.education.map((entry) => (
          <div key={`${entry.institution}-${entry.degree}`}>
            <p className="font-medium">{entry.degree}</p>
            <p className="text-muted-foreground">
              {entry.institution}
              {entry.dates ? ` · ${entry.dates}` : ""}
            </p>
          </div>
        ))}
      </section>
    </article>
  );
}
