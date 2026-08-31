"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  FileText,
  LoaderCircle,
  Lock,
  Sparkles,
} from "lucide-react";

import {
  submitAccountResume,
  type AccountGenerationState,
} from "@/app/actions/generate-account-resume";
import { AccountHeader } from "@/components/account/account-header";
import { ContactInformationPreflight } from "@/components/contact-information-preflight";
import { TailoredResumeResult } from "@/components/pdf";
import { Button } from "@/components/ui/button";
import type { AuthUser } from "@/server/auth/types";

const initialState: AccountGenerationState = { status: "idle" };

export function AccountTailoringWorkspace({
  user,
  masterResumeUpdatedAt,
}: {
  user: AuthUser;
  masterResumeUpdatedAt?: string;
}) {
  const [state, formAction, isPending] = useActionState(
    submitAccountResume,
    initialState,
  );
  const [jobDescription, setJobDescription] = useState("");
  const resultHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (state.status === "success") resultHeading.current?.focus();
    if (state.status === "error") {
      console.error("[resume-generation] Request failed", state.error);
    }
  }, [state]);

  return (
    <div className="page-sky-gradient min-h-screen text-slate-900 antialiased">
      <AccountHeader user={user} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-ink"
        >
          <ArrowLeft aria-hidden className="size-3.5" />
          Back to master résumé
        </Link>

        <div className="mt-4 max-w-2xl">
          <span className="inline-flex rounded-full border border-brand-border bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-ink">
            Account workspace
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Tailor your saved résumé
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 sm:text-base">
            Paste a job description. Opti will use your saved master résumé as the factual source.
          </p>
        </div>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-12">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7 lg:col-span-5">
            <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-brand-border bg-brand-soft/55 p-4">
              <div className="flex gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-brand-ink">
                  <FileText aria-hidden className="size-4" />
                </span>
                <div>
                  <h2 className="text-sm font-bold">Using your saved master résumé</h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {masterResumeUpdatedAt
                      ? `Last updated ${masterResumeUpdatedAt}`
                      : "Stored securely in your account"}
                  </p>
                </div>
              </div>
              <Link href="/dashboard" className="text-xs font-semibold text-brand-ink hover:underline">
                Edit
              </Link>
            </div>

            <form action={formAction}>
              <div className="flex items-start gap-2.5">
                <BriefcaseBusiness aria-hidden className="mt-0.5 size-4 text-brand-ink" />
                <div>
                  <label htmlFor="account-job-description" className="block text-sm font-bold">
                    Job description
                  </label>
                  <p className="text-xs text-slate-500">Paste the complete role posting.</p>
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
                className="mt-3 min-h-72 w-full resize-y rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-muted focus:ring-2 focus:ring-brand-soft disabled:cursor-not-allowed disabled:bg-slate-50"
              />
              <div className="mt-2 flex justify-between text-[11px] text-slate-400">
                <span>Plain text only</span>
                <span>{jobDescription.length.toLocaleString()} / 30,000 characters</span>
              </div>

              {state.status === "error" ? (
                <p role="alert" className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-600">
                  {state.error.message}
                </p>
              ) : null}

              {state.status === "missing_contact_info" ? (
                <ContactInformationPreflight
                  missingFields={state.missingFields}
                  canSave
                  isPending={isPending}
                />
              ) : null}

              {state.status !== "missing_contact_info" ? (
              <Button
                type="submit"
                size="lg"
                disabled={isPending || !jobDescription.trim()}
                className="mt-5 h-11 w-full rounded-xl bg-brand-action text-sm font-semibold text-slate-900 hover:bg-brand-action-hover"
              >
                {isPending ? (
                  <><LoaderCircle aria-hidden className="size-4 animate-spin" /> Tailoring your résumé…</>
                ) : (
                  <><Sparkles aria-hidden className="size-4" /> Tailor my résumé</>
                )}
              </Button>
              ) : null}
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <Lock aria-hidden className="size-3.5" />
                Job descriptions and generated résumés are not saved.
              </p>
            </form>
          </section>

          <section
            aria-live="polite"
            aria-busy={isPending}
            className="flex min-h-[560px] flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7 lg:col-span-7"
          >
            <div className="mb-6 flex items-center gap-2.5">
              <span className="flex size-7 items-center justify-center rounded-lg bg-brand-soft text-brand-ink">
                <Sparkles aria-hidden className="size-4" />
              </span>
              <h2 ref={resultHeading} tabIndex={-1} className="font-bold outline-none">
                Your tailored résumé
              </h2>
            </div>
            {state.status === "success" ? (
              <div className="flex-1 overflow-auto"><TailoredResumeResult resume={state.data} /></div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
                <span className="flex size-16 items-center justify-center rounded-2xl bg-brand-soft text-brand-ink">
                  <FileText aria-hidden className="size-8 stroke-[1.5]" />
                </span>
                <h3 className="mt-4 font-bold">Your tailored résumé will appear here</h3>
                <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-slate-500">
                  Review the result, then download a clean PDF when you are ready.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
