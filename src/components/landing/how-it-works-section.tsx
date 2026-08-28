import { Download, FileText, Search } from "lucide-react";
import { GlowCard } from "./glow-card";
import { SectionBadge } from "./section-badge";

const STEPS = [
  {
    icon: FileText,
    title: "Save your master resume",
    description:
      "Add your standard resume once so Opti has a truthful source for future applications.",
  },
  {
    icon: Search,
    title: "Paste a job description",
    description:
      "For each application, provide the role and let Opti focus your existing experience around it.",
  },
  {
    icon: Download,
    title: "Review and download",
    description:
      "Check the tailored result, then download a clean, single-column PDF.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section className="relative px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <SectionBadge label="How it works" />
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            From job description to tailored PDF
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