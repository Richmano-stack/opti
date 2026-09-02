import Link from "next/link";
import { ArrowRight, Check, FileText, LockKeyhole, Target } from "lucide-react";

function ResumePreview() {
  return (
    <div className="relative mx-auto w-full max-w-[560px] lg:mx-0 lg:ml-auto">
      <div aria-hidden className="absolute -inset-10 -z-10 rounded-full bg-horizon-secondary/15 blur-3xl" />
      <div className="horizon-glass relative overflow-hidden rounded-[2rem] p-3 sm:p-5">
        <div className="flex items-center gap-2 border-b border-white/60 px-2 pb-3">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#27c93f]" />
          <span className="ml-3 text-[10px] font-bold uppercase tracking-[0.16em] text-horizon-muted">Opti workspace</span>
        </div>

        <div className="grid gap-3 pt-3 sm:grid-cols-[0.82fr_1.18fr]">
          <div className="rounded-[1.35rem] border border-white/70 bg-white/55 p-4 backdrop-blur-xl">
            <div className="mb-5 flex items-center gap-2 text-horizon-muted">
              <FileText className="size-4" aria-hidden="true" />
              <span className="text-[10px] font-bold uppercase tracking-[0.12em]">Source</span>
            </div>
            <p className="text-xs font-bold text-horizon-ink">Product designer</p>
            <div className="mt-4 space-y-2">
              <span className="block h-1.5 w-full rounded-full bg-horizon-outline/25" />
              <span className="block h-1.5 w-5/6 rounded-full bg-horizon-outline/20" />
              <span className="block h-1.5 w-11/12 rounded-full bg-horizon-outline/20" />
            </div>
            <div className="mt-6 rounded-2xl bg-horizon-secondary/10 p-3">
              <div className="flex items-center gap-2 text-horizon-secondary">
                <Target className="size-3.5" aria-hidden="true" />
                <span className="text-[9px] font-bold uppercase tracking-[0.1em]">Role focus</span>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-horizon-muted">Senior product designer · Fintech</p>
            </div>
          </div>

          <div className="relative rounded-[1.35rem] border border-white/80 bg-white p-5 shadow-[0_18px_60px_rgba(54,30,20,0.08)] sm:p-6">
            <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-[#e9f8ec] px-2.5 py-1 text-[9px] font-bold text-[#18752a]">
              <Check className="size-3" aria-hidden="true" /> Ready to review
            </span>
            <p className="text-base font-extrabold tracking-tight text-horizon-ink">Maya Chen</p>
            <p className="mt-0.5 text-[10px] font-semibold text-horizon-muted">Product Designer · Nairobi, Kenya</p>
            <div className="my-4 h-px bg-horizon-outline/20" />
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-horizon-primary">Experience</p>
            <p className="mt-3 text-xs font-bold text-horizon-ink">Senior Product Designer</p>
            <p className="mt-1 text-[10px] text-horizon-muted">Built accessible payment journeys across web and mobile.</p>
            <div className="mt-3 space-y-2">
              <span className="block h-1.5 w-full rounded-full bg-horizon-primary/20" />
              <span className="block h-1.5 w-11/12 rounded-full bg-horizon-outline/20" />
              <span className="block h-1.5 w-4/5 rounded-full bg-horizon-outline/20" />
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-horizon-outline/15 pt-4">
              <span className="text-[9px] font-semibold text-horizon-muted">Truthful. Focused. Yours.</span>
              <span className="rounded-full bg-horizon-primary px-3 py-1.5 text-[9px] font-bold text-white">Download PDF</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-36 sm:px-6 sm:pb-28 sm:pt-44 lg:px-8 lg:pb-36">
      <div aria-hidden className="horizon-aurora">
        <span className="horizon-orb horizon-orb-primary" />
        <span className="horizon-orb horizon-orb-secondary" />
        <span className="horizon-orb horizon-orb-tertiary" />
      </div>

      <div className="mx-auto grid max-w-[1120px] items-center gap-16 lg:grid-cols-[0.94fr_1.06fr] lg:gap-12">
        <div>
          <span className="horizon-eyebrow">Resume tailoring, without the fiction</span>
          <h1 aria-label="One resume. Every opportunity, in focus." className="mt-7 max-w-[720px] text-[2.7rem] font-extrabold leading-[1.03] tracking-[-0.045em] text-horizon-ink sm:text-6xl lg:text-[4.25rem]">
            One resume. Every opportunity, <span className="text-horizon-primary">in focus.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-horizon-muted sm:text-lg sm:leading-8">
            Keep one truthful master resume. Paste a job description and Opti reshapes your real experience into a focused, ready-to-review PDF.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/try" className="horizon-button-primary h-13 px-7 text-sm">
              Tailor a resume free <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href="/signup" className="horizon-button-ghost h-13 px-7 text-sm">
              Save my master resume
            </Link>
          </div>

          <div className="mt-7 flex items-center gap-2 text-xs font-semibold text-horizon-muted">
            <LockKeyhole className="size-4 text-horizon-secondary" aria-hidden="true" />
            Nothing from guest sessions is saved
          </div>
        </div>

        <ResumePreview />
      </div>
    </section>
  );
}

