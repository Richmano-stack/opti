import { Download, FileText, RefreshCw, Shield } from "lucide-react";
import { GlowCard } from "./glow-card";
import { SectionBadge } from "./section-badge";

const BENEFITS = [
  {
    icon: FileText,
    title: "One source of truth",
    description:
      "Keep your complete career history in one master resume instead of pasting it into AI tools every time.",
  },
  {
    icon: RefreshCw,
    title: "Tailored for each role",
    description:
      "Paste a job description and Opti selects and rewrites the experience that is most relevant to that opportunity.",
  },
  {
    icon: Shield,
    title: "Grounded in your experience",
    description:
      "Generated content stays anchored to the employers, roles, education, skills, and results in your master resume.",
  },
  {
    icon: Download,
    title: "Ready-to-review PDF",
    description:
      "Review the tailored result and export a clean, single-column PDF that is ATS-friendly and easy to submit.",
  },
] as const;

export function BenefitsSection() {
  return (
    <section className="relative px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <SectionBadge label="Why Opti" />
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Stop rebuilding the same resume
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Let Opti handle the rewriting so you can focus on getting more opportunities.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {BENEFITS.map(({ icon: Icon, title, description }) => (
            <GlowCard key={title}>
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand-ink border border-brand-border">
                <Icon className="size-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">{title}</h3>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-500">
                {description}
              </p>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
}
