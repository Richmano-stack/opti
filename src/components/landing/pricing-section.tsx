"use client";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlowCard } from "./glow-card";
import { SectionBadge } from "./section-badge";

type Plan = {
  name: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
};

const PLANS: Plan[] = [
  {
    name: "Starter",
    monthlyPrice: 12,
    yearlyPrice: 8,
    description: "Perfect for occasional job applications.",
    features: [
      "3 resume optimizations / month",
      "ATS compatibility score",
      "Basic keyword insights",
      "PDF export",
    ],
    cta: "Get Started",
  },
  {
    name: "Pro",
    monthlyPrice: 17,
    yearlyPrice: 12,
    description: "For active job seekers who apply weekly.",
    features: [
      "Unlimited optimizations",
      "Real-time keyword matching",
      "AI bullet rewrites",
      "All premium templates",
      "Priority support",
    ],
    popular: true,
    cta: "Get Started",
  },
  {
    name: "Enterprise",
    monthlyPrice: null,
    yearlyPrice: null,
    description: "For teams, bootcamps, and career centers.",
    features: [
      "Bulk seat licensing",
      "Custom branding",
      "Admin dashboard",
      "API access",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
  },
];

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul className="mt-6 space-y-3">
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-blue-400">
            <Check className="size-3" />
          </span>
          {feature}
        </li>
      ))}
    </ul>
  );
}

export function PricingSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <section className="relative px-4 py-24 sm:px-6 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute bottom-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <SectionBadge label="Pricing" />
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Flexible Pricing Plans
          </h2>

          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-border bg-card/40 p-1.5">
            <button
              type="button"
              onClick={() => setYearly(false)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-all",
                !yearly
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setYearly(true)}
              className={cn(
                "relative rounded-full px-5 py-2 text-sm font-medium transition-all",
                yearly
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Yearly
              <span className="absolute -right-2 -top-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                30% off
              </span>
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => {
            const price =
              plan.monthlyPrice === null
                ? null
                : yearly
                  ? plan.yearlyPrice
                  : plan.monthlyPrice;

            return (
              <GlowCard
                key={plan.name}
                highlighted={plan.popular}
                className={cn(
                  "relative flex flex-col",
                  plan.popular && "lg:-mt-4 lg:mb-4",
                )}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-1 text-xs font-bold text-primary-foreground">
                    Popular
                  </span>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>

                  <div className="mt-6 flex items-baseline gap-1">
                    {price !== null ? (
                      <>
                        <span className="text-4xl font-bold text-foreground">
                          ${price}
                        </span>
                        <span className="text-muted-foreground">/mo</span>
                      </>
                    ) : (
                      <span className="text-4xl font-bold text-foreground">
                        Custom
                      </span>
                    )}
                  </div>

                  <FeatureList features={plan.features} />
                </div>

                <Link
                  href={plan.name === "Enterprise" ? "#" : "/signup"}
                  className={cn(
                    "mt-8 h-11 w-full text-sm",
                    plan.popular ? "btn-brand" : "btn-brand-outline",
                  )}
                >
                  {plan.cta}
                </Link>
              </GlowCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
