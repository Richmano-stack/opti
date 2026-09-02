import { ArrowDown, Download, ScanSearch, SquarePen } from "lucide-react";

const STEPS = [
  {
    icon: SquarePen,
    number: "01",
    title: "Bring your source",
    description: "Paste your master resume for a guest session, or save it once with an account.",
  },
  {
    icon: ScanSearch,
    number: "02",
    title: "Set the opportunity",
    description: "Add the job description so Opti understands what the role calls for.",
  },
  {
    icon: Download,
    number: "03",
    title: "Review, then export",
    description: "Inspect the tailored result and download a clean, selectable-text PDF.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8" aria-labelledby="process-title">
      <div className="relative mx-auto max-w-[1120px] overflow-hidden rounded-[2rem] bg-horizon-ink px-6 py-14 text-white sm:px-10 sm:py-16 lg:px-14">
        <div aria-hidden className="absolute -right-28 -top-36 size-96 rounded-full bg-horizon-secondary/25 blur-3xl" />
        <div aria-hidden className="absolute -bottom-48 left-1/3 size-96 rounded-full bg-horizon-tertiary/20 blur-3xl" />

        <div className="relative">
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.17em] text-white/80">How it works</span>
          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <h2 id="process-title" className="max-w-xl text-3xl font-bold leading-tight tracking-[-0.03em] sm:text-4xl">
              From source resume to focused application.
            </h2>
            <p className="max-w-sm text-sm leading-6 text-white/60">A simple workflow for guests today and a faster repeat workflow when you create an account.</p>
          </div>

          <ol className="mt-12 grid gap-4 lg:grid-cols-3">
            {STEPS.map(({ icon: Icon, number, title, description }, index) => (
              <li key={title} className="relative rounded-[1.5rem] border border-white/15 bg-white/8 p-6 backdrop-blur-xl sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-[0.14em] text-horizon-inverse-primary">{number}</span>
                  <Icon className="size-5 text-white/80" aria-hidden="true" />
                </div>
                <h3 className="mt-12 text-xl font-bold tracking-[-0.02em]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/60">{description}</p>
                {index < STEPS.length - 1 ? (
                  <ArrowDown className="mt-6 size-4 text-white/30 lg:hidden" aria-hidden="true" />
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
