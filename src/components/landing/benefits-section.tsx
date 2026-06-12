import {
  Bot,
  FileCheck,
  LayoutTemplate,
  MessageSquare,
  ScanSearch,
  Target,
} from "lucide-react";
import { GlowCard } from "./glow-card";
import { SectionBadge } from "./section-badge";

const BENEFITS = [
  {
    icon: FileCheck,
    title: "ATS-Proof Scoring",
    description:
      "Get an instant compatibility score and AI-driven fixes so your resume passes automated screening every time.",
  },
  {
    icon: ScanSearch,
    title: "Real-Time Keyword Insights",
    description:
      "See live feedback on missing keywords and skill gaps as you tailor your resume to any job description.",
  },
  {
    icon: Target,
    title: "Tailored Job Matching",
    description:
      "Flexibly adjust your target role and industry — our AI rewrites content to match what recruiters search for.",
  },
  {
    icon: Bot,
    title: "Instant AI Rewrites",
    description:
      "Transform weak bullet points into impact-driven achievements with quantified results in seconds.",
  },
  {
    icon: LayoutTemplate,
    title: "Format Automation",
    description:
      "Choose from clean, recruiter-approved templates that stay perfectly formatted across every export.",
  },
  {
    icon: MessageSquare,
    title: "Expert Review Sync",
    description:
      "24/7 AI assistance that mirrors career-coach feedback — polish tone, structure, and clarity on demand.",
  },
] as const;

export function BenefitsSection() {
  return (
    <section className="relative px-4 py-24 sm:px-6 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <SectionBadge label="Benefits" />
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Why Choose Our Optimizer?
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
