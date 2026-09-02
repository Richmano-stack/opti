"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowLeft, ArrowRight, BriefcaseBusiness, FileText, LoaderCircle, LockKeyhole, RotateCcw } from "lucide-react";

import { submitAccountResume, type AccountGenerationState } from "@/app/actions/generate-account-resume";
import { AccountGeneratorHeader } from "@/components/account/account-generator-header";
import { AuthenticatedFooter } from "@/components/account/authenticated-footer";
import { ContactInformationPreflight } from "@/components/contact-information-preflight";
import { TailoredResumeResult } from "@/components/pdf";
import type { AuthUser } from "@/server/auth/types";
import type { OptimizedResume } from "@/services/ai/types";

const initialState: AccountGenerationState = { status: "idle" };

export function AccountTailoringWorkspace({ user, masterResumeUpdatedAt }: { user: AuthUser; masterResumeUpdatedAt?: string }) {
  const [state, formAction, isPending] = useActionState(submitAccountResume, initialState);
  const [jobDescription, setJobDescription] = useState("");
  const resultHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (state.status === "success") resultHeading.current?.focus();
    if (state.status === "error") console.error("[resume-generation] Request failed", state.error);
  }, [state]);

  return (
    <div className="horizon-page min-h-screen text-horizon-ink antialiased">
      <AccountGeneratorHeader user={user} />
      <main className="mx-auto max-w-[1120px] px-4 py-10 sm:px-6 sm:py-14">
        <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full text-xs font-bold text-horizon-muted hover:text-horizon-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-primary">
          <ArrowLeft aria-hidden className="size-3.5" /> Back to master résumé
        </Link>

        {state.status === "success" ? (
          <AccountGeneratorReview resume={state.data} resultHeading={resultHeading} jobDescription={jobDescription} masterResumeUpdatedAt={masterResumeUpdatedAt} />
        ) : (
          <div className="mx-auto mt-10 max-w-[760px]">
            <div className="text-center">
              <span className="horizon-eyebrow">Account tailoring</span>
              <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">Start with the role</h1>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-horizon-muted sm:text-base">Paste the complete job description. Your saved master résumé remains the only factual source.</p>
            </div>

            <section className="horizon-glass mt-10 rounded-[2rem] p-6 sm:p-9" aria-labelledby="job-description-title">
              <SavedSource updatedAt={masterResumeUpdatedAt} />
              <form action={formAction} className="mt-7">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-horizon-secondary/10 text-horizon-secondary"><BriefcaseBusiness aria-hidden className="size-5" /></span>
                  <div>
                    <label id="job-description-title" htmlFor="account-job-description" className="block text-base font-bold">Job description</label>
                    <p className="mt-1 text-xs text-horizon-muted">Plain text · up to 30,000 characters</p>
                  </div>
                </div>
                <textarea
                  id="account-job-description"
                  name="jobDescription"
                  value={jobDescription}
                  onChange={(event) => setJobDescription(event.target.value)}
                  maxLength={30_000}
                  required
                  disabled={isPending}
                  placeholder="Paste the full job description here"
                  className="mt-5 min-h-72 w-full resize-y rounded-[1.5rem] border border-white/75 bg-white/55 p-5 text-sm leading-7 text-horizon-ink outline-none backdrop-blur-xl transition placeholder:text-horizon-muted/55 focus:border-horizon-secondary/40 focus:ring-4 focus:ring-horizon-secondary/10 disabled:cursor-wait disabled:opacity-70"
                />
                <div className="mt-2 flex justify-end text-[10px] font-bold tracking-wide text-horizon-muted"><span>{jobDescription.length.toLocaleString()} / 30,000</span></div>

                {state.status === "error" ? <ErrorNotice message={state.error.message} /> : null}
                {state.status === "missing_contact_info" ? <ContactInformationPreflight missingFields={state.missingFields} canSave isPending={isPending} /> : null}
                {state.status !== "missing_contact_info" ? (
                  <button type="submit" disabled={isPending || !jobDescription.trim()} className="horizon-button-primary mt-6 h-13 w-full px-7 text-sm disabled:pointer-events-none disabled:opacity-50">
                    <GeneratorSubmitContent isPending={isPending} />
                  </button>
                ) : null}
                <p className="mt-4 flex items-center justify-center gap-2 text-[11px] text-horizon-muted"><LockKeyhole aria-hidden className="size-3.5 text-horizon-secondary" /> Job descriptions and generated résumés are not saved.</p>
              </form>
            </section>
          </div>
        )}
      </main>
      <AuthenticatedFooter />
    </div>
  );
}

function SavedSource({ updatedAt }: { updatedAt?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-white/70 bg-white/45 p-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-horizon-primary/10 text-horizon-primary"><FileText aria-hidden className="size-4" /></span>
        <div className="min-w-0"><p className="truncate text-sm font-bold">Using your saved master résumé</p><p className="mt-0.5 text-[11px] text-horizon-muted">{updatedAt ? `Last updated ${updatedAt}` : "Stored securely in your account"}</p></div>
      </div>
      <Link href="/dashboard" className="shrink-0 text-xs font-bold text-horizon-primary hover:underline">Edit</Link>
      
    </div>
  );
}

export function GeneratorSubmitContent({ isPending }: { isPending: boolean }) {
  return isPending ? <><LoaderCircle aria-hidden className="size-4 animate-spin" /> Tailoring your résumé…</> : <>Tailor my résumé <ArrowRight aria-hidden className="size-4" /></>;
}

export function ErrorNotice({ message }: { message: string }) {
  return (
    <div role="alert" className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200/70 bg-red-50/80 p-4 text-red-900">
      <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
      <div><p className="text-xs font-bold">We couldn’t tailor this résumé</p><p className="mt-1 text-xs leading-5 text-red-700">{message}</p></div>
      
    </div>
  );
}

export function AccountGeneratorReview({ resume, resultHeading, jobDescription, masterResumeUpdatedAt }: {
  resume: OptimizedResume;
  resultHeading: React.RefObject<HTMLHeadingElement | null>;
  jobDescription: string;
  masterResumeUpdatedAt?: string;
}) {
  return (
    <div className="mt-8 grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="horizon-glass rounded-[1.5rem] p-5 lg:sticky lg:top-6">
        <span className="horizon-eyebrow">Ready to review</span>
        <h1 ref={resultHeading} tabIndex={-1} className="mt-5 text-2xl font-extrabold tracking-[-0.03em] outline-none">Your tailored résumé</h1>
        <p className="mt-3 text-xs leading-6 text-horizon-muted">Read every section before downloading. You remain in control of the final document.</p>
        <div className="mt-6"><SavedSource updatedAt={masterResumeUpdatedAt} /></div>
        <div className="mt-4 rounded-2xl bg-horizon-secondary/8 p-4"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-horizon-secondary">Role context</p><p className="mt-2 line-clamp-4 text-xs leading-5 text-horizon-muted">{jobDescription}</p></div>
        <button type="button" onClick={() => window.location.reload()} className="horizon-button-ghost mt-5 h-10 w-full px-4 text-xs"><RotateCcw aria-hidden className="size-3.5" /> Tailor another</button>
      </aside>
      <section aria-live="polite" className="min-w-0 rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_70px_rgba(47,49,49,0.08)] sm:p-7">
        <TailoredResumeResult resume={resume} />
      </section>
      
    </div>
  );
}



