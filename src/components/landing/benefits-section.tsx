import { Download, FileCheck2, RefreshCw, ShieldCheck } from "lucide-react";

const BENEFITS = [
  {
    icon: FileCheck2,
    label: "One source",
    title: "Your complete story stays intact.",
    description: "Save one master resume with the experience, skills, and outcomes that are actually yours.",
    tone: "primary",
  },
  {
    icon: RefreshCw,
    label: "Role by role",
    title: "Relevance without rewriting from zero.",
    description: "Opti emphasizes the parts of your background that matter to each job description.",
    tone: "secondary",
  },
  {
    icon: ShieldCheck,
    label: "Truth first",
    title: "No invented employers or achievements.",
    description: "Every tailored result remains grounded in the source resume you provide.",
    tone: "tertiary",
  },
  {
    icon: Download,
    label: "Ready to send",
    title: "Review once. Download a clean PDF.",
    description: "The final document keeps a conventional single-column reading order and selectable text.",
    tone: "primary",
  },
] as const;

const toneClasses = {
  primary: "bg-horizon-primary/10 text-horizon-primary",
  secondary: "bg-horizon-secondary/10 text-horizon-secondary",
  tertiary: "bg-horizon-tertiary/10 text-horizon-tertiary",
} as const;

export function BenefitsSection() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8" aria-labelledby="benefits-title">
      <div className="mx-auto max-w-[1120px]">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <span className="horizon-eyebrow">Why Opti</span>
            <h2 id="benefits-title" className="mt-5 text-3xl font-bold leading-tight tracking-[-0.03em] text-horizon-ink sm:text-4xl">
              A sharper application starts with what is already true.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-horizon-muted lg:justify-self-end">
            Opti is designed around restraint: preserve your facts, reduce repetitive work, and give every opportunity the most relevant version of your experience.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {BENEFITS.map(({ icon: Icon, label, title, description, tone }, index) => (
            <article
              key={title}
              className={`horizon-glass group rounded-[1.5rem] p-7 transition-transform duration-300 hover:-translate-y-1 sm:p-9 ${index === 0 || index === 3 ? "md:col-span-1" : ""}`}
            >
              <div className="flex items-start justify-between gap-6">
                <span className={`flex size-11 items-center justify-center rounded-2xl ${toneClasses[tone]}`}>
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-horizon-muted">0{index + 1}</span>
              </div>
              <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.16em] text-horizon-muted">{label}</p>
              <h3 className="mt-2 max-w-md text-xl font-bold tracking-[-0.02em] text-horizon-ink sm:text-2xl">{title}</h3>
              <p className="mt-3 max-w-lg text-sm leading-6 text-horizon-muted">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
