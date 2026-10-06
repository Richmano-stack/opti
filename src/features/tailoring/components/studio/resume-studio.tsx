"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { submitGuestResume } from "@/features/tailoring/actions/generate-resume";
import { submitAccountResume } from "@/features/tailoring/actions/generate-account-resume";
import { ResumeStudioCanvas } from "./resume-studio-canvas";
import { ResumeStudioHeader } from "./resume-studio-header";
import { ResumeStudioSidebar } from "./resume-studio-sidebar";
import type { DevSampleInput } from "@/features/devtools/lib/sample-inputs";
import type { AuthUser } from "@/server/auth/types";

export type ResumeStudioProps =
  | {
      mode: "guest";
    }
  | {
      mode: "account";
      user: AuthUser;
      masterResumeUpdatedAt?: string;
    };

function GuestStudio() {
  const [state, formAction, isPending] = useActionState(submitGuestResume, { status: "idle" });
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [editingSources, setEditingSources] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const isReady = Boolean(resumeText.trim() && jobDescription.trim());
  const resume = state.status === "success" ? state.data : undefined;
  const missingFields = state.status === "missing_contact_info" ? state.missingFields : undefined;
  const errorMessage = state.status === "error" ? state.error.message : undefined;

  useEffect(() => {
    if (state.status === "success") {
      headingRef.current?.focus();
    }
    if (state.status === "error") {
      console.error("[resume-generation] Guest generation failed", state.error);
    }
  }, [state]);

  const handleFillSample = (sample: DevSampleInput) => {
    setResumeText(sample.resume);
    setJobDescription(sample.jobDescription);
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-white text-horizon-ink antialiased selection:bg-horizon-inverse-primary selection:text-horizon-ink">
      <form action={formAction} className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <ResumeStudioHeader
          resume={resume}
          jobDescription={jobDescription}
          isPending={isPending}
          isReady={isReady}
          headingRef={headingRef}
          mode="guest"
        />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
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
            editingSources={editingSources}
            onToggleEditingSources={() => setEditingSources((open) => !open)}
            onFillSample={handleFillSample}
            resume={resume}
          />
          <ResumeStudioCanvas
            resume={resume}
            isPending={isPending}
            isReady={isReady}
          />
        </div>
      </form>
    </div>
  );
}

function AccountStudio({
  user,
  masterResumeUpdatedAt,
}: {
  user: AuthUser;
  masterResumeUpdatedAt?: string;
}) {
  const [state, formAction, isPending] = useActionState(submitAccountResume, { status: "idle" });
  const [jobDescription, setJobDescription] = useState("");
  const [editingSources, setEditingSources] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const isReady = Boolean(jobDescription.trim());
  const resume = state.status === "success" ? state.data : undefined;
  const missingFields = state.status === "missing_contact_info" ? state.missingFields : undefined;
  const errorMessage = state.status === "error" ? state.error.message : undefined;

  useEffect(() => {
    if (state.status === "success") {
      headingRef.current?.focus();
    }
    if (state.status === "error") {
      console.error("[resume-generation] Account generation failed", state.error);
    }
  }, [state]);

  const handleFillSample = (sample: DevSampleInput) => {
    setJobDescription(sample.jobDescription);
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-white text-horizon-ink antialiased selection:bg-horizon-inverse-primary selection:text-horizon-ink">
      <form action={formAction} className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <ResumeStudioHeader
          resume={resume}
          jobDescription={jobDescription}
          isPending={isPending}
          isReady={isReady}
          headingRef={headingRef}
          mode="account"
          user={user}
        />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
          <ResumeStudioSidebar
            mode="account"
            masterResumeUpdatedAt={masterResumeUpdatedAt}
            resumeText=""
            onResumeTextChange={() => undefined}
            jobDescription={jobDescription}
            onJobDescriptionChange={setJobDescription}
            isPending={isPending}
            isReady={isReady}
            missingFields={missingFields}
            errorMessage={errorMessage}
            editingSources={editingSources}
            onToggleEditingSources={() => setEditingSources((open) => !open)}
            onFillSample={handleFillSample}
            resume={resume}
          />
          <ResumeStudioCanvas
            resume={resume}
            isPending={isPending}
            isReady={isReady}
          />
        </div>
      </form>
    </div>
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
    />
  );
}
