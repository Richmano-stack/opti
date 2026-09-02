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
    <footer className="mt-4 bg-horizon-ink px-4 pb-8 pt-14 text-white sm:px-6 sm:pt-20 lg:px-8">
      <div className="mx-auto max-w-[1120px]">
        <div className="flex flex-col gap-8 border-b border-white/15 pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.17em] text-horizon-inverse-primary">Your next application</span>
            <h2 className="mt-5 text-3xl font-bold leading-tight tracking-[-0.03em] sm:text-5xl">Make the next application feel like yours.</h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-white/60">One truthful source. A sharper version for every role.</p>
          </div>
          <Link href="/try" className="horizon-button-primary h-12 shrink-0 bg-white px-6 text-sm !text-horizon-ink hover:bg-horizon-inverse-primary">Start with a job description <ArrowRight className="size-4" aria-hidden="true" /></Link>
        </div>
        <div className="grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_0.7fr_0.7fr]">
          <div><BrandMark /><p className="mt-4 max-w-xs text-xs leading-5 text-white/50">A calm, truthful way to tailor your resume for the work ahead.</p></div>
          <div><p className="text-[10px] font-bold uppercase tracking-[0.17em] text-white/40">Explore</p><nav aria-label="Footer navigation" className="mt-4 grid gap-3 text-sm font-semibold text-white/75"><a href="#benefits" className="hover:text-white">Why Opti</a><a href="#how-it-works" className="hover:text-white">How it works</a><Link href="/try" className="hover:text-white">Try it free</Link></nav></div>
          <div><p className="text-[10px] font-bold uppercase tracking-[0.17em] text-white/40">Principles</p><div className="mt-4 grid gap-3 text-sm font-semibold text-white/75"><span>Truth over keywords</span><span>Review before export</span><span>Private by default</span></div></div>
          <div><p className="text-[10px] font-bold uppercase tracking-[0.17em] text-white/40">Privacy boundary</p><p className="mt-4 text-sm leading-6 text-white/60">Guest inputs and generated results are not saved.</p><a href="#privacy" className="mt-3 inline-flex text-xs font-bold text-horizon-inverse-primary hover:text-white">Read our boundary <ArrowRight className="ml-1 size-3.5" aria-hidden="true" /></a></div>
        </div>
        <div className="flex flex-col gap-2 border-t border-white/15 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} Opti. All rights reserved.</span><span>Built for focused applications.</span></div>
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


