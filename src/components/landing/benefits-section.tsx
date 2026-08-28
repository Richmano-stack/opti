import { Download, FileText, RefreshCw, ShieldCheck } from "lucide-react";
import { GlowCard } from "./glow-card";
import { SectionBadge } from "./section-badge";

const BENEFITS = [
  {
    icon: FileText,
    title: "One source of truth",
    description:
      "Keep your complete career history in one master resume instead of pasting it into a new AI chat for every application.",
  },
  {
    icon: RefreshCw,
    title: "Tailored for each role",
    description:
      "Paste a job description and Opti selects and rewrites the experience that is most relevant to that opportunity.",
  },
  {
    icon: ShieldCheck,
    title: "Grounded in your experience",
    description:
      "Generated content stays anchored to the employers, roles, education, skills, and results in your master resume.",
  },
  {
    icon: Download,
    title: "Ready-to-review PDF",
    description:
      "Review the tailored result and export a clean, single-column PDF with selectable text.",
  },
] as const;

export function BenefitsSection() {
  return (
    <section className="relative px-4 py-24 sm:px-6 lg:px-8">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <SectionBadge label="Why Opti" />
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Stop rebuilding the same resume
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {BENEFITS.map(({ icon: Icon, title, description }) => (
            <GlowCard key={title}>
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
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