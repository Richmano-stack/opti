"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight, FileText, LoaderCircle, RotateCcw } from "lucide-react";

import { ResumeStudio } from "@/features/tailoring/components/studio/resume-studio";
import { TailoredResumeResult } from "@/features/tailoring/pdf";
import type { AuthUser } from "@/server/auth/types";
import type { OptimizedResume } from "@/features/tailoring/lib/types";

export function AccountTailoringWorkspace({
  user,
  masterResumeUpdatedAt,
}: {
  user: AuthUser;
  masterResumeUpdatedAt?: string;
}) {
  return <ResumeStudio mode="account" user={user} masterResumeUpdatedAt={masterResumeUpdatedAt} />;
}

export function GeneratorSubmitContent({ isPending }: { isPending: boolean }) {
  return isPending ? (
    <>
      <LoaderCircle aria-hidden className="size-4 animate-spin" /> Tailoring your résumé…
    </>
  ) : (
    <>
      Tailor my résumé <ArrowRight aria-hidden className="size-4" />
    </>
  );
}

export function ErrorNotice({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200/70 bg-red-50/80 p-4 text-red-900"
    >
      <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
      <div>
        <p className="text-xs font-bold">We couldn’t tailor this résumé</p>
        <p className="mt-1 text-xs leading-5 text-red-700">{message}</p>
      </div>
    </div>
  );
}

export function AccountGeneratorReview({
  resume,
  resultHeading,
  jobDescription,
  masterResumeUpdatedAt,
}: {
  resume: OptimizedResume;
  resultHeading: React.RefObject<HTMLHeadingElement | null>;
  jobDescription: string;
  masterResumeUpdatedAt?: string;
}) {
  return (
    <div className="mt-5 grid items-start gap-4 lg:min-h-0 lg:flex-1 lg:grid-cols-[280px_minmax(0,1fr)] lg:overflow-hidden">
      <aside className="horizon-glass rounded-[1.5rem] p-5 lg:h-full lg:overflow-y-auto">
        <span className="horizon-eyebrow">Ready to review</span>
        <h1
          ref={resultHeading}
          tabIndex={-1}
          className="mt-5 text-2xl font-extrabold tracking-[-0.03em] outline-none"
        >
          Your tailored résumé
        </h1>
        <p className="mt-3 text-xs leading-6 text-horizon-muted">
          Read every section before downloading. You remain in control of the final document.
        </p>
        <div className="mt-6">
          <div className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-white/70 bg-white/45 p-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-horizon-primary/10 text-horizon-primary">
                <FileText aria-hidden className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">Using your saved master résumé</p>
                <p className="mt-0.5 text-[11px] text-horizon-muted">
                  {masterResumeUpdatedAt
                    ? `Last updated ${masterResumeUpdatedAt}`
                    : "Stored securely in your account"}
                </p>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="shrink-0 text-xs font-bold text-horizon-primary hover:underline"
            >
              Edit
            </Link>
          </div>
        </div>
        <div className="mt-4 rounded-2xl bg-horizon-secondary/8 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-horizon-secondary">
            Role context
          </p>
          <p className="mt-2 line-clamp-4 text-xs leading-5 text-horizon-muted">
            {jobDescription}
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="horizon-button-ghost mt-5 h-10 w-full px-4 text-xs"
        >
          <RotateCcw aria-hidden className="size-3.5" /> Tailor another
        </button>
      </aside>
      <section
        aria-live="polite"
        className="min-w-0 rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_70px_rgba(47,49,49,0.08)] sm:p-7 lg:h-full lg:overflow-y-auto"
      >
        <TailoredResumeResult resume={resume} />
      </section>
    </div>
  );
}
