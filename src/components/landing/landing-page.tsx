import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

import { BenefitsSection } from "./benefits-section";
import { BrandMark } from "./brand-mark";
import { HeroSection } from "./hero-section";
import { HowItWorksSection } from "./how-it-works-section";
import { LandingNavbar } from "./landing-navbar";

function ProductTrustBanner() {
  return (
    <section id="privacy" className="scroll-mt-28 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="horizon-glass mx-auto grid max-w-[1120px] gap-10 rounded-[2rem] p-7 sm:p-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:p-14">
        <div className="flex items-start gap-5">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-horizon-primary/10 text-horizon-primary">
            <ShieldCheck className="size-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-horizon-primary">A deliberate boundary</p>
            <h2 className="mt-3 text-2xl font-bold tracking-[-0.025em] text-horizon-ink sm:text-3xl">Built around your real experience</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-horizon-muted sm:text-base">
              Opti may rephrase and prioritize your source material. It does not invent employers, roles, dates, credentials, or achievements.
            </p>
          </div>
        </div>
        <div className="grid gap-3 text-sm font-semibold text-horizon-ink sm:grid-cols-2 lg:grid-cols-1">
          <span className="flex items-center gap-3 rounded-2xl bg-white/55 px-4 py-3"><CheckCircle2 className="size-4 text-[#27C93F]" aria-hidden="true" /> Guest inputs are not saved</span>
          <span className="flex items-center gap-3 rounded-2xl bg-white/55 px-4 py-3"><CheckCircle2 className="size-4 text-[#27C93F]" aria-hidden="true" /> You review before download</span>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-4 pb-20 pt-4 sm:px-6 sm:pb-28 lg:px-8">
      <div className="mx-auto max-w-[900px] text-center">
        <span className="horizon-eyebrow">Your next application</span>
        <h2 className="mt-6 text-3xl font-bold leading-tight tracking-[-0.035em] text-horizon-ink sm:text-5xl">Let the role change—not your whole workflow.</h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-horizon-muted">Try the complete tailoring flow without creating an account.</p>
        <Link href="/try" className="horizon-button-primary mt-8 h-13 px-8 text-sm">Try Opti free <ArrowRight className="size-4" aria-hidden="true" /></Link>
      </div>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer className="border-t border-horizon-outline/15 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <BrandMark />
          <p className="mt-3 text-xs text-horizon-muted">One truthful resume. Focused for every opportunity.</p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-5 text-xs font-semibold text-horizon-muted">
          <a href="#benefits" className="hover:text-horizon-ink">Why Opti</a>
          <a href="#how-it-works" className="hover:text-horizon-ink">How it works</a>
          <Link href="/try" className="hover:text-horizon-ink">Try it free</Link>
        </nav>
        <p className="text-xs text-horizon-muted">© {new Date().getFullYear()} Opti</p>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <div className="horizon-page min-h-screen text-horizon-ink">
      <LandingNavbar />
      <main>
        <HeroSection />
        <div id="benefits" className="scroll-mt-28"><BenefitsSection /></div>
        <div id="how-it-works" className="scroll-mt-28"><HowItWorksSection /></div>
        <ProductTrustBanner />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  );
}
