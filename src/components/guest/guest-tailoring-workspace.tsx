"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { ArrowRight, LoaderCircle, Lock, Sparkles } from "lucide-react";

import {
  submitGuestResume,
  type GuestGenerationState,
} from "@/app/actions/generate-resume";
import { ContactInformationPreflight } from "@/components/contact-information-preflight";
import {
  GuestResultPanel,
  GuestTextAreaField,
  GuestTrustRow,
  GuestWorkspaceFooter,
} from "@/components/guest/guest-workspace-ui";
import { LandingNavbar } from "@/components/landing/landing-navbar";

const initialState: GuestGenerationState = { status: "idle" };

export function GuestTailoringWorkspace() {
  const [state, formAction, isPending] = useActionState(submitGuestResume, initialState);
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const isReady = Boolean(resume.trim() && jobDescription.trim());
  const hasResult = state.status === "success";

  useEffect(() => {
    if (state.status === "success") resultHeading.current?.focus();
    if (state.status === "error") {
      console.error("[resume-generation] Request failed", state.error);
    }
  }, [state]);

  return (
    <div className="min-h-screen bg-[#f3f2ef] text-horizon-ink antialiased selection:bg-horizon-inverse-primary selection:text-horizon-ink">
      <LandingNavbar />

      <main className="mx-auto max-w-6xl px-4 pb-6 pt-36 sm:px-6 sm:pb-8 sm:pt-40">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-horizon-primary">
              {hasResult ? "Step 2 of 2" : "Step 1 of 2"}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] text-horizon-ink sm:text-4xl">
              {hasResult ? "Your tailored résumé is ready." : "Shape your next opportunity."}
            </h1>
            <p className="mt-2 text-sm leading-6 text-neutral-700">
              {hasResult
                ? "Review every detail before downloading your PDF."
                : "Paste your résumé and the role description. We’ll create a focused draft for you to review."}
            </p>
          </div>
        </div>

        <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <section aria-labelledby="guest-source-heading" className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-horizon-secondary">Source documents</p>
              <h2 id="guest-source-heading" className="mt-1.5 text-xl font-semibold tracking-[-0.02em] text-horizon-ink">Paste your source material</h2>
              <p className="mt-1 text-sm leading-6 text-neutral-700">Both fields are required. Plain text works best.</p>
            </div>
            <form action={formAction} className="space-y-4">
              <GuestTextAreaField
                id="guest-resume"
                name="resume"
                value={resume}
                onChange={setResume}
                label="Master résumé"
                placeholder="Paste your complete résumé here"
                maxChars={50_000}
                disabled={isPending}
              />

              <GuestTextAreaField
                id="guest-job-description"
                name="jobDescription"
                value={jobDescription}
                onChange={setJobDescription}
                label="Job description"
                placeholder="Paste the complete job posting here"
                maxChars={30_000}
                disabled={isPending}
              />

              {state.status === "error" ? (
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800">
                  {state.error.message}
                </p>
              ) : null}

              {state.status === "missing_contact_info" ? (
                <ContactInformationPreflight
                  missingFields={state.missingFields}
                  canSave={false}
                  isPending={isPending}
                />
              ) : null}

              {state.status !== "missing_contact_info" ? (
                <div className="border-t border-neutral-200 pt-4">
                  {!isReady && !isPending ? (
                    <p className="mb-3 text-xs font-medium text-neutral-700">Add both documents to continue.</p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={isPending || !isReady}
                    className="horizon-button-primary h-11 w-full px-6 text-sm disabled:pointer-events-none disabled:opacity-45"
                  >
                    {isPending ? (
                      <>
                        <LoaderCircle aria-hidden className="size-4 animate-spin motion-reduce:animate-none" />
                        Tailoring your résumé...
                      </>
                    ) : (
                      <>
                        <Sparkles aria-hidden className="size-4" />
                        Tailor my résumé
                        <ArrowRight aria-hidden className="ml-1 size-4" />
                      </>
                    )}
                  </button>
                  <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-neutral-700">
                    <Lock aria-hidden className="size-3.5 text-horizon-secondary" />
                    Nothing is saved after this session.
                  </p>
                </div>
              ) : null}
            </form>
          </section>

          <GuestResultPanel state={state} isPending={isPending} headingRef={resultHeading} />
        </div>

        <GuestTrustRow />
      </main>
      <GuestWorkspaceFooter />
    </div>
  );
}




