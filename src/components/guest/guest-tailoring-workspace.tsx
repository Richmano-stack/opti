"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, LoaderCircle, Lock, RotateCcw, Sparkles } from "lucide-react";

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
import { AuthenticatedFooter } from "@/components/account/authenticated-footer";
import { SAMPLE_JOB_DESCRIPTION, SAMPLE_MASTER_RESUME } from "@/data/sample-resume-fixtures";
import { loadGuestDraft, saveGuestDraft } from "@/lib/guest-session-storage";

const initialState: GuestGenerationState = { status: "idle" };

export function GuestTailoringWorkspace() {
  const [state, formAction, isPending] = useActionState(submitGuestResume, initialState);
  const [stateOverride, setStateOverride] = useState<GuestGenerationState | null>(null);
  const effectiveState = isPending ? state : (stateOverride ?? state);
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const isReady = Boolean(resume.trim() && jobDescription.trim());
  const hasResult = effectiveState.status === "success";

  // Hydrate from guest draft on mount
  useEffect(() => {
    const draft = loadGuestDraft();
    if (draft) {
      if (draft.masterResume) setResume(draft.masterResume);
      if (draft.jobDescription) setJobDescription(draft.jobDescription);
    }
  }, []);

  // Auto-save draft whenever inputs change
  useEffect(() => {
    if (resume || jobDescription) {
      saveGuestDraft({ masterResume: resume, jobDescription: jobDescription });
    }
  }, [resume, jobDescription]);

  useEffect(() => {
    if (effectiveState.status === "success") {
      resultHeading.current?.focus();
      // Persist the generated result too so it survives auth navigation
      saveGuestDraft({ masterResume: resume, jobDescription: jobDescription, tailoredResume: effectiveState.data });
    }
    if (effectiveState.status === "error") {
      console.error("[resume-generation] Request failed", effectiveState.error);
    }
  }, [effectiveState]); // eslint-disable-line react-hooks/exhaustive-deps

  // Save draft before navigating to auth (belt-and-suspenders)
  const handleBeforeAuthNav = useCallback(() => {
    saveGuestDraft({ masterResume: resume, jobDescription: jobDescription });
  }, [resume, jobDescription]);

  // Reset job description and result while preserving master resume
  const handleResetJob = useCallback(() => {
    setJobDescription("");
    setStateOverride(initialState);
    saveGuestDraft({ masterResume: resume, jobDescription: "" });
  }, [resume]);

  // Pre-fill fields with realistic sample data
  const handleLoadSampleData = useCallback(() => {
    setResume(SAMPLE_MASTER_RESUME);
    setJobDescription(SAMPLE_JOB_DESCRIPTION);
    setStateOverride(initialState);
    saveGuestDraft({
      masterResume: SAMPLE_MASTER_RESUME,
      jobDescription: SAMPLE_JOB_DESCRIPTION,
    });
  }, []);

  return (
    <div className="horizon-page relative min-h-screen overflow-hidden text-horizon-ink antialiased selection:bg-horizon-inverse-primary selection:text-horizon-ink">
      <div aria-hidden className="horizon-aurora fixed">
        <span className="horizon-orb horizon-orb-primary" />
        <span className="horizon-orb horizon-orb-secondary" />
        <span className="horizon-orb horizon-orb-tertiary" />
      </div>
      <GuestWorkspaceHeader onBeforeNavigate={handleBeforeAuthNav} />

      <main className="relative mx-auto max-w-[1728px] px-6 pb-12 pt-8 sm:px-8 sm:pt-12 lg:px-16 lg:pb-16">
        <div className="mb-8 max-w-3xl lg:mb-10">
          <span className="horizon-eyebrow">{hasResult ? "Step 2 of 2" : "Step 1 of 2"}</span>
          <h1 className="mt-5 text-[2.5rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-horizon-ink sm:text-5xl lg:text-[3.5rem]">
            {hasResult ? "Your tailored résumé is ready." : "Shape your next opportunity."}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-horizon-muted sm:text-lg">
            {hasResult
              ? "Review every detail before downloading your PDF."
              : "Paste your résumé and the role description. We’ll create a focused draft for you to review."}
          </p>
        </div>

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(20rem,0.82fr)_minmax(0,1.18fr)] xl:gap-8">
          <section aria-labelledby="guest-source-heading" className="horizon-glass rounded-3xl p-5 sm:p-8 lg:p-10">
            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-horizon-secondary">Source documents</p>
                <h2 id="guest-source-heading" className="mt-2 text-2xl font-semibold tracking-[-0.01em] text-horizon-ink">Paste your source material</h2>
                <p className="mt-2 text-sm leading-6 text-horizon-muted">Both fields are required. Plain text works best.</p>
              </div>
              <button
                type="button"
                onClick={handleLoadSampleData}
                disabled={isPending}
                className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-horizon-secondary/25 bg-white/70 px-3.5 py-1.5 text-xs font-bold text-horizon-ink transition hover:bg-white hover:text-horizon-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-primary disabled:pointer-events-none disabled:opacity-50 sm:self-auto"
              >
                <Sparkles aria-hidden className="size-3.5 text-horizon-secondary" />
                Use Sample Resume &amp; Job
              </button>
            </div>
            <form
              action={(formData) => {
                setStateOverride(null);
                formAction(formData);
              }}
              className="space-y-6"
            >
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

              {effectiveState.status === "error" ? (
                <p role="alert" className="rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm font-medium text-red-800">
                  {effectiveState.error.message}
                </p>
              ) : null}

              {effectiveState.status === "missing_contact_info" ? (
                <ContactInformationPreflight
                  missingFields={effectiveState.missingFields}
                  canSave={false}
                  isPending={isPending}
                />
              ) : null}

              {effectiveState.status !== "missing_contact_info" ? (
                <div className="pt-1">
                  {!isReady && !isPending ? (
                    <p className="mb-3 text-xs font-medium text-horizon-muted">Add both documents to continue.</p>
                  ) : null}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isPending || !isReady}
                    className="h-13 w-full rounded-full border-0 bg-horizon-primary px-6 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#8b1a00] focus-visible:ring-horizon-primary active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45"
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
                  </Button>
                  {hasResult ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleResetJob}
                      className="mt-3 h-11 w-full rounded-full border border-horizon-outline/20 text-xs font-bold text-horizon-ink hover:bg-black/5"
                    >
                      <RotateCcw aria-hidden className="mr-1.5 size-3.5" />
                      Tailor another job
                    </Button>
                  ) : null}
                  <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-horizon-muted">
                    <Lock aria-hidden className="size-3.5 text-horizon-secondary" />
                    Nothing is saved after this session.
                  </p>
                </div>
              ) : null}
            </form>
          </section>

          <GuestResultPanel
            state={effectiveState}
            isPending={isPending}
            headingRef={resultHeading}
            onSaveDraft={handleBeforeAuthNav}
            onReset={handleResetJob}
          />
        </div>

        <GuestTrustRow />
      </main>
      <AuthenticatedFooter />
    </div>
  );
}




