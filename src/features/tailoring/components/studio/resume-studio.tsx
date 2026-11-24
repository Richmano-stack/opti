"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

import { AuthenticatedAppShell } from "@/components/horizon/authenticated-app-shell";
import { Button } from "@/components/ui/button";
import { submitGuestResume } from "@/features/tailoring/actions/generate-resume";
import { submitAccountResume } from "@/features/tailoring/actions/generate-account-resume";
import { ResumeStudioCanvas } from "./resume-studio-canvas";
import {
  DownloadErrorAlert,
  ResumeStudioHeader,
  StudioActions,
  StudioHeading,
  studioRoleLabel,
  useResumeDownload,
} from "./resume-studio-header";
import { ResumeStudioPanels } from "./resume-studio-panels";
import { ResumeStudioSidebar } from "./resume-studio-sidebar";
import { clearGuestDraft, loadGuestDraft, saveGuestDraft } from "@/features/tailoring/lib/guest-session-storage";
import { SAMPLE_JOB_DESCRIPTION, SAMPLE_MASTER_RESUME } from "@/features/tailoring/lib/sample-resume-fixtures";
import type { DevSampleInput } from "@/features/devtools/lib/sample-inputs";
import type { AuthUser } from "@/server/auth/types";
import type { TemplateId } from "@/templates/registry";

export type ResumeStudioProps =
  | {
      mode: "guest";
    }
  | {
      mode: "account";
      user: AuthUser;
      masterResumeUpdatedAt?: string;
      initialTemplateId?: TemplateId;
    };

function GuestStudio() {
  const [state, formAction, isPending] = useActionState(submitGuestResume, { status: "idle" });
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [stateOverride, setStateOverride] = useState<Awaited<ReturnType<typeof submitGuestResume>> | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);
  const templateId: TemplateId = "minimal";
  const headingRef = useRef<HTMLHeadingElement>(null);

  const isReady = Boolean(resumeText.trim() && jobDescription.trim());
  const effectiveState = isPending ? state : (stateOverride ?? state);
  const resume = effectiveState.status === "success" ? effectiveState.data : undefined;
  const missingFields = effectiveState.status === "missing_contact_info" ? effectiveState.missingFields : undefined;
  const errorMessage = effectiveState.status === "error" ? effectiveState.error.message : undefined;
  const { isDownloading, downloadError, download } = useResumeDownload(resume, templateId);

  useEffect(() => {
    const draft = loadGuestDraft();
    const restoreTimer = window.setTimeout(() => {
      if (draft) {
        setResumeText(draft.masterResume);
        setJobDescription(draft.jobDescription);
        if (draft.tailoredResume) setStateOverride({ status: "success", data: draft.tailoredResume });
      }
      setDraftRestored(true);
    }, 0);
    return () => window.clearTimeout(restoreTimer);
  }, []);

  useEffect(() => {
    if (!draftRestored) return;
    saveGuestDraft({ masterResume: resumeText, jobDescription, tailoredResume: resume });
  }, [draftRestored, resumeText, jobDescription, resume]);

  useEffect(() => {
    if (effectiveState.status === "success") {
      headingRef.current?.focus();
    }
    if (effectiveState.status === "error") {
      console.error("[resume-generation] Guest generation failed", effectiveState.error);
    }
  }, [effectiveState]);

  const handleFillSample = (sample: DevSampleInput) => {
    setResumeText(sample.resume);
    setJobDescription(sample.jobDescription);
    setStateOverride({ status: "idle" });
  };

  const handleUseSample = () => {
    setResumeText(SAMPLE_MASTER_RESUME);
    setJobDescription(SAMPLE_JOB_DESCRIPTION);
    setStateOverride({ status: "idle" });
  };

  const handleReset = () => {
    setJobDescription("");
    setStateOverride({ status: "idle" });
    saveGuestDraft({ masterResume: resumeText, jobDescription: "" });
  };

  const handleClearDraft = () => {
    clearGuestDraft();
    setResumeText("");
    setJobDescription("");
    setStateOverride({ status: "idle" });
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-white text-horizon-ink antialiased selection:bg-horizon-inverse-primary selection:text-horizon-ink">
      <form action={(formData) => { setStateOverride(null); formAction(formData); }} className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <ResumeStudioHeader jobDescription={jobDescription} headingRef={headingRef} />
        <DownloadErrorAlert message={downloadError} />
        <ResumeStudioPanels
          previewReady={Boolean(resume)}
          inputs={
            <ResumeStudioSidebar
              mode="guest"
              resumeText={resumeText}
              onResumeTextChange={setResumeText}
              jobDescription={jobDescription}
              onJobDescriptionChange={setJobDescription}
              isPending={isPending}
              isReady={isReady}
              missingFields={missingFields}
              errorMessage={errorMessage}
              onFillSample={handleFillSample}
              onUseSample={handleUseSample}
              onClearDraft={handleClearDraft}
              resume={resume}
            />
          }
          preview={
            <ResumeStudioCanvas
              resume={resume}
              isPending={isPending}
              templateId={templateId}
              callout={resume ? (
                <div className="mx-1 mb-2 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-horizon-secondary/20 bg-horizon-secondary/5 px-3 py-2 text-xs">
                  <p>Save your master résumé to a free account so you can return to it whenever you apply.</p>
                  <div className="flex items-center gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={handleReset}>
                      <RotateCcw aria-hidden data-icon="inline-start" /> Tailor another job
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      nativeButton={false}
                      render={<Link href="/signup?intent=save_draft" onClick={() => saveGuestDraft({ masterResume: resumeText, jobDescription, tailoredResume: resume })} />}
                    >
                      Save to free account
                    </Button>
                  </div>
                </div>
              ) : null}
              actions={
                <StudioActions
                  resume={resume}
                  isPending={isPending}
                  isDownloading={isDownloading}
                  onDownload={download}
                  size="sm"
                />
              }
            />
          }
        />
      </form>
    </div>
  );
}

function AccountStudio({
  user,
  masterResumeUpdatedAt,
  initialTemplateId = "minimal",
}: {
  user: AuthUser;
  masterResumeUpdatedAt?: string;
  initialTemplateId?: TemplateId;
}) {
  const [state, formAction, isPending] = useActionState(submitAccountResume, { status: "idle" });
  const [jobDescription, setJobDescription] = useState("");
  const [stateOverride, setStateOverride] = useState<Awaited<ReturnType<typeof submitAccountResume>> | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);
  const templateId = initialTemplateId;
  const headingRef = useRef<HTMLHeadingElement>(null);

  const isReady = Boolean(jobDescription.trim());
  const effectiveState = isPending ? state : (stateOverride ?? state);
  const effectiveResume = effectiveState.status === "success" ? effectiveState.data : undefined;
  const effectiveMissingFields = effectiveState.status === "missing_contact_info" ? effectiveState.missingFields : undefined;
  const effectiveErrorMessage = effectiveState.status === "error" ? effectiveState.error.message : undefined;
  const { isDownloading, downloadError, download } = useResumeDownload(effectiveResume, templateId);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      const draft = loadGuestDraft();
      if (!draft) return;
      if (draft.jobDescription) setJobDescription(draft.jobDescription);
      if (draft.tailoredResume) setStateOverride({ status: "success", data: draft.tailoredResume });
      setDraftRestored(true);
      clearGuestDraft();
    }, 0);
    return () => window.clearTimeout(restoreTimer);
  }, []);

  useEffect(() => {
    if (effectiveState.status === "success") {
      headingRef.current?.focus();
    }
    if (effectiveState.status === "error") {
      console.error("[resume-generation] Account generation failed", effectiveState.error);
    }
  }, [effectiveState]);

  const handleFillSample = (sample: DevSampleInput) => {
    setJobDescription(sample.jobDescription);
    setStateOverride({ status: "idle" });
  };

  const handleReset = () => {
    setJobDescription("");
    setStateOverride({ status: "idle" });
  };

  return (
    <AuthenticatedAppShell
      user={user}
      title="Tailor"
      fill
      heading={<StudioHeading label={studioRoleLabel(jobDescription)} headingRef={headingRef} />}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden text-horizon-ink antialiased selection:bg-horizon-inverse-primary selection:text-horizon-ink">
        {draftRestored ? <div role="status" className="border-b bg-horizon-secondary/5 px-4 py-2 text-center text-sm">Your guest session was restored. Review the draft and save your résumé to your account when ready.</div> : null}
        <DownloadErrorAlert message={downloadError} />
        <form action={(formData) => { setStateOverride(null); formAction(formData); }} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <ResumeStudioPanels
            previewReady={Boolean(effectiveResume)}
            inputs={
              <ResumeStudioSidebar
                mode="account"
                masterResumeUpdatedAt={masterResumeUpdatedAt}
                resumeText=""
                onResumeTextChange={() => undefined}
                jobDescription={jobDescription}
                onJobDescriptionChange={setJobDescription}
                isPending={isPending}
                isReady={isReady}
                missingFields={effectiveMissingFields}
                errorMessage={effectiveErrorMessage}
                onFillSample={handleFillSample}
                resume={effectiveResume}
              />
            }
            preview={
              <ResumeStudioCanvas
                resume={effectiveResume}
                isPending={isPending}
                templateId={templateId}
                callout={effectiveResume ? (
                  <div className="mx-1 mb-2 flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card px-3 py-2 text-xs">
                    <p>Ready to tailor your saved master résumé for another role?</p>
                    <Button type="button" size="sm" variant="outline" onClick={handleReset}>
                      <RotateCcw aria-hidden data-icon="inline-start" /> Tailor another job
                    </Button>
                  </div>
                ) : null}
                actions={
                  <StudioActions
                    resume={effectiveResume}
                    isPending={isPending}
                    isDownloading={isDownloading}
                    onDownload={download}
                    size="sm"
                  />
                }
              />
            }
          />
        </form>
      </div>
    </AuthenticatedAppShell>
  );
}

export function ResumeStudio(props: ResumeStudioProps) {
  if (props.mode === "guest") {
    return <GuestStudio />;
  }
  return (
    <AccountStudio
      user={props.user}
      masterResumeUpdatedAt={props.masterResumeUpdatedAt}
      initialTemplateId={props.initialTemplateId}
    />
  );
}
