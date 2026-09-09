"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowLeft, ArrowRight, BriefcaseBusiness, FileText, LoaderCircle, LockKeyhole, RotateCcw } from "lucide-react";

import { submitAccountResume, type AccountGenerationState } from "@/app/actions/generate-account-resume";
import { AuthenticatedAppShell } from "@/components/horizon/authenticated-app-shell";
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
    <AuthenticatedAppShell user={user} title="Tailor a résumé">
      <section aria-label="Tailoring workspace" className="mx-auto flex min-h-[calc(100dvh-8rem)] max-w-[90rem] flex-col px-4 py-5 sm:px-6 lg:h-full lg:min-h-0 lg:overflow-hidden lg:px-8 lg:py-6">
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full text-xs font-bold text-horizon-muted hover:text-horizon-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-primary">
              <ArrowLeft aria-hidden className="size-3.5" /> Back to master résumé
            </Link>
            <h1 className="mt-3 text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">Start with the role</h1>
          </div>
          <p className="max-w-xl text-sm leading-6 text-horizon-muted sm:text-right">Paste the complete job description. Your saved master résumé remains the only factual source.</p>
        </div>

        {state.status === "success" ? (
          <AccountGeneratorReview resume={state.data} resultHeading={resultHeading} jobDescription={jobDescription} masterResumeUpdatedAt={masterResumeUpdatedAt} />
        ) : (
          <div className="mt-5 grid gap-4 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <section className="horizon-glass flex min-h-[32rem] flex-col rounded-[1.5rem] p-5 sm:p-6 lg:min-h-0" aria-labelledby="job-description-title">
              <form action={formAction} className="flex min-h-0 flex-1 flex-col">
                <div className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-horizon-secondary/10 text-horizon-secondary"><BriefcaseBusiness aria-hidden className="size-4" /></span>
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
                  className="mt-4 min-h-72 w-full resize-y rounded-xl border border-horizon-outline/15 bg-white/70 p-5 text-sm leading-7 text-horizon-ink outline-none transition placeholder:text-horizon-muted/55 focus:border-horizon-secondary/40 focus:ring-4 focus:ring-horizon-secondary/10 disabled:cursor-wait disabled:opacity-70 lg:min-h-0 lg:flex-1 lg:resize-none"
                />
                <div className="mt-2 flex justify-end text-[10px] font-bold tracking-wide text-horizon-muted"><span>{jobDescription.length.toLocaleString()} / 30,000</span></div>

                {state.status === "error" ? <ErrorNotice message={state.error.message} /> : null}
                {state.status === "missing_contact_info" ? <ContactInformationPreflight missingFields={state.missingFields} canSave isPending={isPending} /> : null}
                {state.status !== "missing_contact_info" ? (
                  <button type="submit" disabled={isPending || !jobDescription.trim()} className="horizon-button-primary mt-3 h-11 w-full px-7 text-sm disabled:pointer-events-none disabled:opacity-50 sm:ml-auto sm:w-auto">
                    <GeneratorSubmitContent isPending={isPending} />
                  </button>
                ) : null}
              </form>
            </section>

            <aside aria-label="Tailoring source details" className="horizon-glass rounded-[1.5rem] p-5 lg:overflow-y-auto">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-horizon-primary">Factual source</p>
              <div className="mt-4"><SavedSource updatedAt={masterResumeUpdatedAt} /></div>
              <div className="mt-5 border-t border-horizon-outline/15 pt-5">
                <p className="flex items-start gap-2 text-xs leading-5 text-horizon-muted"><LockKeyhole aria-hidden className="mt-0.5 size-3.5 shrink-0 text-horizon-secondary" />Job descriptions and generated résumés are not saved.</p>
              </div>
            </aside>
          </div>
        )}
      </section>
    </AuthenticatedAppShell>
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
    <div className="mt-5 grid items-start gap-4 lg:min-h-0 lg:flex-1 lg:grid-cols-[280px_minmax(0,1fr)] lg:overflow-hidden">
      <aside className="horizon-glass rounded-[1.5rem] p-5 lg:h-full lg:overflow-y-auto">
        <span className="horizon-eyebrow">Ready to review</span>
        <h1 ref={resultHeading} tabIndex={-1} className="mt-5 text-2xl font-extrabold tracking-[-0.03em] outline-none">Your tailored résumé</h1>
        <p className="mt-3 text-xs leading-6 text-horizon-muted">Read every section before downloading. You remain in control of the final document.</p>
        <div className="mt-6"><SavedSource updatedAt={masterResumeUpdatedAt} /></div>
        <div className="mt-4 rounded-2xl bg-horizon-secondary/8 p-4"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-horizon-secondary">Role context</p><p className="mt-2 line-clamp-4 text-xs leading-5 text-horizon-muted">{jobDescription}</p></div>
        <button type="button" onClick={() => window.location.reload()} className="horizon-button-ghost mt-5 h-10 w-full px-4 text-xs"><RotateCcw aria-hidden className="size-3.5" /> Tailor another</button>
      </aside>
      <section aria-live="polite" className="min-w-0 rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_20px_70px_rgba(47,49,49,0.08)] sm:p-7 lg:h-full lg:overflow-y-auto">
        <TailoredResumeResult resume={resume} />
      </section>
      
    </div>
  );
}






