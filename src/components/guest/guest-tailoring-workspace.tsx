"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { LoaderCircle, Lock, Sparkles } from "lucide-react";

import {
  submitGuestResume,
  type GuestGenerationState,
} from "@/app/actions/generate-resume";
import { ContactInformationPreflight } from "@/components/contact-information-preflight";
import {
  GuestResultPanel,
  GuestTextAreaField,
  GuestTrustRow,
  GuestWorkspaceHeader,
} from "@/components/guest/guest-workspace-ui";
import { Button } from "@/components/ui/button";

const initialState: GuestGenerationState = { status: "idle" };

export function GuestTailoringWorkspace() {
  const [state, formAction, isPending] = useActionState(submitGuestResume, initialState);
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const isReady = Boolean(resume.trim() && jobDescription.trim());

  useEffect(() => {
    if (state.status === "success") resultHeading.current?.focus();
    if (state.status === "error") {
      console.error("[resume-generation] Request failed", state.error);
    }
  }, [state]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-sky-50/45 to-sky-100/45 text-slate-900 antialiased selection:bg-sky-100 selection:text-slate-900">
      <GuestWorkspaceHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-7 max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Tailor your résumé for this role
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
            Paste your résumé and the job description. Nothing is saved after this session.
          </p>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <section aria-labelledby="guest-source-heading" className="rounded-xl border border-sky-100 bg-white/95 p-5 shadow-xs sm:p-6">
            <h2 id="guest-source-heading" className="sr-only">Source documents</h2>
            <form action={formAction} className="space-y-5">
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
                <p role="alert" className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-700">
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
                <div className="pt-1">
                  {!isReady && !isPending ? (
                    <p className="mb-2 text-xs text-slate-500">Add both documents to continue.</p>
                  ) : null}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isPending || !isReady}
                    className="h-12 w-full border-0 bg-gradient-to-r from-sky-300 via-sky-100 to-white text-sm font-bold text-slate-900 shadow-sm transition-[filter,transform] hover:from-sky-200 hover:via-sky-50 hover:to-white hover:brightness-[1.02] focus-visible:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-50"
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
                      </>
                    )}
                  </Button>
                  <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                    <Lock aria-hidden className="size-3.5 text-slate-400" />
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
    </div>
  );
}
