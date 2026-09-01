import { CheckCircle2, ShieldCheck } from "lucide-react";

import { BenefitsSection } from "./benefits-section";
import { HeroSection } from "./hero-section";
import { HowItWorksSection } from "./how-it-works-section";
import { LandingNavbar } from "./landing-navbar";

function OptiLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-brand-ink" aria-hidden="true">
        <path d="M12 2C12.5 7.5 16.5 11.5 22 12C16.5 12.5 12.5 16.5 12 22C11.5 16.5 7.5 12.5 2 12C7.5 11.5 11.5 7.5 12 2Z" />
      </svg>
      <span className="text-lg font-bold tracking-tight text-slate-900">Opti</span>
    </div>
  );
}

function ProductTrustBanner() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border border-brand-border bg-white/80 p-6 shadow-xs sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex max-w-2xl items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-brand-border bg-brand-soft text-brand-ink">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 sm:text-lg">Built around your real experience</h2>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">Opti prioritizes what is already in your master resume. It does not invent employers, qualifications, or achievements.</p>
              </div>
            </div>
            <div className="grid shrink-0 gap-2 text-xs font-medium text-slate-600 sm:grid-cols-2 md:grid-cols-1">
              <div className="flex items-center gap-2"><CheckCircle2 className="size-4 text-brand-ink" aria-hidden="true" />Guest inputs are not saved</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="size-4 text-brand-ink" aria-hidden="true" />You review before download</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const footerLinkClass =
  "rounded-sm transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink focus-visible:ring-offset-4";

function LandingFooter() {
  return (
    <footer className="mt-12 border-t border-slate-200/70 bg-white/70 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <OptiLogo />
            <p className="max-w-xs text-xs leading-relaxed text-slate-500">Keep one truthful master resume and tailor it for each opportunity.</p>
          </div>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-slate-600">
            <a href="#benefits" className={footerLinkClass}>Why Opti</a>
            <a href="#how-it-works" className={footerLinkClass}>How it works</a>
            <a href="/try" className={footerLinkClass}>Try it free</a>
          </nav>
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {new Date().getFullYear()} Opti. All rights reserved.</span>
          <span>Your data stays private and secure.</span>
        </div>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <div className="page-sky-gradient min-h-screen text-slate-900">
      <LandingNavbar />
      <main>
        <HeroSection />
        <div id="benefits"><BenefitsSection /></div>
        <div id="how-it-works"><HowItWorksSection /></div>
        <ProductTrustBanner />
      </main>
      <LandingFooter />
    </div>
  );
}
