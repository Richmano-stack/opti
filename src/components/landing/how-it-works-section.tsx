import { Fragment } from "react";
import { ArrowRight, Download, FileText, Search } from "lucide-react";
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
      "Check the tailored result, then download a clean, single-column ATS-friendly PDF.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section className="relative px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <SectionBadge label="How it works" />
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            From job description to tailored PDF
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Three simple steps to submit tailored applications in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
          {STEPS.map(({ icon: Icon, title, description }, index) => (
            <Fragment key={title}>
              <GlowCard className="h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-ink bg-brand-soft px-2 py-0.5 rounded border border-brand-border">
                      STEP {index + 1}
                    </span>
                    <div className="inline-flex size-8 items-center justify-center rounded-lg bg-brand-soft text-brand-ink border border-brand-border">
                      <Icon className="size-4" />
                    </div>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">{title}</h3>
                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-500">
                    {description}
                  </p>
                </div>
              </GlowCard>

              {index < STEPS.length - 1 ? (
                <div
                  key={`arrow-${title}`}
                  className="hidden md:flex items-center justify-center text-brand-ink px-1"
                >
                  <ArrowRight className="size-4" />
                </div>
              ) : null}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
