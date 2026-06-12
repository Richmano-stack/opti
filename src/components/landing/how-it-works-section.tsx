import { Download, FileText, Sparkles } from "lucide-react";
import { GlowCard } from "./glow-card";
import { SectionBadge } from "./section-badge";

const STEPS = [
  {
    icon: FileText,
    title: "Paste your inputs",
    description:
      "Add your current resume and the job description you are applying for.",
  },
  {
    icon: Sparkles,
    title: "AI optimization",
    description:
      "Gemini rewrites bullet points to mirror the role’s keywords and skills — without inventing experience.",
  },
  {
    icon: Download,
    title: "Download PDF",
    description:
      "Preview the result and download a single-column, ATS-parseable PDF.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section className="relative px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <SectionBadge label="How it works" />
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Three steps to a tailored resume
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, description }, index) => (
            <GlowCard key={title}>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                Step {index + 1}
              </p>
              <div className="mb-4 mt-4 inline-flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                <Icon className="size-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
}
