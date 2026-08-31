import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  Lock,
  Pencil,
  Shield,
  Sparkles,
} from "lucide-react";

// The Interactive Workflow Illustration from the design mockup
function HeroWorkflowGraphic() {
  return (
    <div className="relative w-full max-w-lg select-none">
      {/* Ambient background blur */}
      <div className="absolute -inset-4 rounded-3xl bg-brand-soft/50 blur-2xl -z-10" />

      {/* Floating Sparkle Accents */}
      <div className="absolute -top-3 left-1/3 text-brand-muted">
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
          <path d="M12 2C12.5 7.5 16.5 11.5 22 12C16.5 12.5 12.5 16.5 12 22C11.5 16.5 7.5 12.5 2 12C7.5 11.5 11.5 7.5 12 2Z" />
        </svg>
      </div>
      <div className="absolute top-12 -right-3 text-brand-muted">
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
          <path d="M12 2C12.5 7.5 16.5 11.5 22 12C16.5 12.5 12.5 16.5 12 22C11.5 16.5 7.5 12.5 2 12C7.5 11.5 11.5 7.5 12 2Z" />
        </svg>
      </div>
      <div className="absolute bottom-16 -right-2 text-brand-muted">
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-3">
          <path d="M12 2C12.5 7.5 16.5 11.5 22 12C16.5 12.5 12.5 16.5 12 22C11.5 16.5 7.5 12.5 2 12C7.5 11.5 11.5 7.5 12 2Z" />
        </svg>
      </div>

      {/* Main Container Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-12 items-center gap-3 sm:gap-4">
          {/* Left Column: Master Resume & Job Description */}
          <div className="col-span-5 space-y-4">
            {/* Master Resume Box */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs">
              <div className="flex items-center gap-1.5 mb-2">
                <FileText className="size-3.5 text-brand-ink" />
                <span className="text-[11px] font-bold text-slate-800">Master Resume</span>
              </div>
              <div className="space-y-1.5">
                <div className="h-1.5 w-12 rounded-full bg-brand-action" />
                <div className="h-1.5 w-full rounded-full bg-slate-100" />
                <div className="h-1.5 w-4/5 rounded-full bg-slate-100" />
                <div className="h-1.5 w-3/4 rounded-full bg-slate-100" />
                <div className="h-1.5 w-5/6 rounded-full bg-slate-100" />
              </div>
            </div>

            {/* Job Description Box */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs">
              <div className="flex items-center gap-1.5 mb-2">
                <Pencil className="size-3.5 text-brand-ink" />
                <span className="text-[11px] font-bold text-slate-800">Job Description</span>
              </div>
              <div className="space-y-1.5">
                <div className="h-1.5 w-16 rounded-full bg-brand-action-hover" />
                <div className="h-1.5 w-full rounded-full bg-slate-100" />
                <div className="h-1.5 w-4/5 rounded-full bg-slate-100" />
                <div className="h-1.5 w-3/5 rounded-full bg-slate-100" />
              </div>
            </div>
          </div>

          {/* Center Connector / Flow Node */}
          <div className="col-span-2 flex flex-col items-center justify-center">
            <div className="flex size-9 items-center justify-center rounded-full bg-brand-action text-slate-900 shadow-md shadow-sky-200/30">
              <Sparkles className="size-4" />
            </div>
          </div>

          {/* Right Column: Tailored Resume Document */}
          <div className="col-span-5">
            <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-sm">
              <div className="mb-2">
                <span className="text-[11px] font-bold text-slate-900 block">Tailored Resume</span>
              </div>

              {/* Header profile area */}
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                <div className="size-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-3">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div className="space-y-1 flex-1">
                  <div className="h-1.5 w-14 rounded-full bg-slate-300" />
                  <div className="h-1 w-20 rounded-full bg-slate-100" />
                </div>
              </div>

              {/* Highlighted section bars */}
              <div className="space-y-1.5 mb-2.5">
                <div className="h-1.5 w-full rounded-full bg-brand-action" />
                <div className="h-1 w-full rounded-full bg-slate-100" />
                <div className="h-1.5 w-4/5 rounded-full bg-brand-action-hover" />
              </div>

              {/* Bullet list items */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="size-1 rounded-full bg-slate-300 shrink-0" />
                  <div className="h-1 w-full rounded-full bg-slate-100" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="size-1 rounded-full bg-slate-300 shrink-0" />
                  <div className="h-1 w-5/6 rounded-full bg-slate-100" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="size-1 rounded-full bg-slate-300 shrink-0" />
                  <div className="h-1 w-4/5 rounded-full bg-slate-100" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="size-1 rounded-full bg-slate-300 shrink-0" />
                  <div className="h-1 w-3/4 rounded-full bg-slate-100" />
                </div>
              </div>

              {/* ATS Friendly badge */}
              <div className="mt-3 flex justify-end">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 border border-emerald-200">
                  <Check className="size-2.5" />
                  ATS-friendly
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:px-8">
      {/* Ambient background glows */}
      <div aria-hidden className="ambient-glow">
        <div className="absolute left-1/2 top-0 h-[450px] w-[800px] -translate-x-1/2 rounded-full bg-brand-soft/50 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Headline & Action Buttons */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3.5 py-1 text-xs font-semibold text-brand-ink border border-brand-border">
              <Sparkles className="size-3.5" />
              <span>AI Resume Tailoring for Every Role</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] leading-[1.1]">
              One resume.
              <br />
              Tailored for
              <br />
              <span className="text-brand-ink">every application.</span>
            </h1>

            <p className="text-sm leading-relaxed text-slate-500 sm:text-base max-w-md">
              Save your master resume. When you find a job, paste its description and get a
              focused, ready-to-review PDF without rebuilding your resume from scratch.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <Link
                href="/try"
                className="h-11 rounded-xl bg-brand-action hover:bg-brand-action-hover text-slate-900 font-semibold text-xs sm:text-sm px-5 shadow-sm shadow-sky-200/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="size-4" />
                Try it free (Guest)
              </Link>

              <Link
                href="/signup"
                className="h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-700 hover:text-slate-900 text-xs sm:text-sm px-5 shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Save your resume
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            {/* 3 Value Props underneath */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Shield className="size-3.5 text-brand-ink" />
                <span>No sign up required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="size-3.5 text-brand-ink" />
                <span>Private & secure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-brand-ink" />
                <span>ATS-friendly</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Diagram Illustration */}
          <div className="flex justify-center lg:col-span-6 lg:justify-end">
            <HeroWorkflowGraphic />
          </div>
        </div>
      </div>
    </section>
  );
}
