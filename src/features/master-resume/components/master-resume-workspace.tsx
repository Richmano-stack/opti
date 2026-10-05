"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, LoaderCircle, LockKeyhole } from "lucide-react";

import { saveMasterResume } from "@/features/master-resume/actions/save-master-resume";
import { AuthenticatedAppShell } from "@/components/horizon/authenticated-app-shell";
import { ActionGroup, ContentContainer, DocumentPreviewCard, HorizonDialog, ScrollRegion } from "@/components/horizon/page-composition";
import { DevSampleFill } from "@/features/devtools/components/dev-sample-fill";
import { HorizonButton, HorizonTextarea } from "@/components/horizon";
import type { AuthUser } from "@/server/auth/types";

const MAX_CHARACTERS = 50_000;

interface MasterResumeWorkspaceProps {
  user: AuthUser;
  initialContent?: string;
  initialUpdatedAt?: string;
}

export function MasterResumeWorkspace({ user, initialContent = "", initialUpdatedAt }: MasterResumeWorkspaceProps) {
  const [savedContent, setSavedContent] = useState(initialContent);
  const [draft, setDraft] = useState(initialContent);
  const [lastSavedAt, setLastSavedAt] = useState<string | undefined>(initialUpdatedAt);
  const [error, setError] = useState<string | null>(null);
  const [isSavedRecently, setIsSavedRecently] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const isPendingRef = useRef(false);
  const savedContentRef = useRef(savedContent);
  const isSetup = savedContent.trim().length > 0;
  const isDirty = draft !== savedContent;
  const canSave = draft.trim().length > 0 && (isDirty || !isSetup);

  const openEditor = () => {
    setDraft(savedContent);
    setError(null);
    setIsEditorOpen(true);
  };

  useEffect(() => {
    isPendingRef.current = isPending;
    savedContentRef.current = savedContent;
  }, [isPending, savedContent]);

  const requestClose = useCallback(() => {
    if (isPendingRef.current) return;
    setDraft(savedContentRef.current);
    setError(null);
    setIsEditorOpen(false);
  }, []);

  const handleSave = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      setError("Master resume content cannot be empty.");
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await saveMasterResume(draft);
      if (result.ok) {
        setSavedContent(result.data.content);
        setDraft(result.data.content);
        setLastSavedAt(new Date(result.data.updatedAt).toLocaleTimeString());
        setIsSavedRecently(true);
        setError(null);
        setIsEditorOpen(false);
        return;
      }
      setError(result.error.message);
    });
  };

  const editorTitle = isSetup ? "Edit master résumé" : "Add master résumé";

  return (
    <AuthenticatedAppShell user={user} title="Master résumé">
      <ContentContainer className="py-6 sm:py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl space-y-2">
              <p className="text-horizon-meta font-bold uppercase tracking-[0.14em] text-horizon-primary">Workspace</p>
              <h1 className="text-horizon-heading font-bold tracking-[-0.025em] text-horizon-ink sm:text-horizon-title">Master résumé</h1>
              <p className="text-horizon-body leading-6 text-horizon-muted">
                {isSetup
                  ? "Your source document is saved. Tailor it for a role without editing the original."
                  : "Save one source résumé. Tailoring stays locked until it exists."}
              </p>
            </div>
            {isSetup ? (
              <Link
                href="/dashboard/generator"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--horizon-radius-control)] bg-horizon-primary px-4 text-sm font-bold text-white transition hover:bg-horizon-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary focus-visible:ring-offset-2 sm:w-auto"
              >
                Tailor for a role <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            ) : null}
          </div>

          <div aria-live="polite" aria-atomic="true">
            {isSavedRecently ? (
              <p className="flex items-center gap-2 rounded-[var(--horizon-radius-control)] border border-[#27c93f]/20 bg-[#27c93f]/10 px-4 py-3 text-sm font-bold text-[#116f20]">
                <CheckCircle2 aria-hidden="true" className="size-4" />
                Your master résumé is saved.
              </p>
            ) : null}
          </div>

          <DocumentPreviewCard
            action={
              <HorizonButton onClick={openEditor} ref={editButtonRef} tone={isSetup ? "secondary" : "primary"} type="button">
                {editorTitle}
              </HorizonButton>
            }
            metadata={
              <span>
                {isSetup ? "Saved" : "Not saved"}
                {lastSavedAt ? ` · Last saved at ${lastSavedAt}` : ""}
                {` · ${savedContent.length.toLocaleString()} / ${MAX_CHARACTERS.toLocaleString()} characters`}
              </span>
            }
            summary={isSetup ? "A compact preview of your saved source document." : "Add your experience before tailoring for a role."}
            title="Source document"
          />
        </div>
      </ContentContainer>

      <HorizonDialog
        description="This is the only résumé Opti stores. Job descriptions and generated results stay temporary."
        footer={
          <ActionGroup className="sm:justify-end">
            <HorizonButton disabled={isPending} onClick={requestClose} tone="secondary" type="button">
              Cancel
            </HorizonButton>
            <HorizonButton aria-busy={isPending || undefined} disabled={isPending || !canSave} onClick={handleSave} type="button">
              {isPending ? (
                <>
                  <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                  Saving…
                </>
              ) : isSetup ? (
                "Save changes"
              ) : (
                "Save master resume"
              )}
            </HorizonButton>
          </ActionGroup>
        }
        isOpen={isEditorOpen}
        onClose={requestClose}
        size="wide"
        title={editorTitle}
      >
        <div className="space-y-4">
          {error ? (
            <p className="rounded-[var(--horizon-radius-control)] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800" role="alert">
              {error}
            </p>
          ) : null}
          <div className="flex flex-col gap-1 text-horizon-meta font-semibold text-horizon-muted sm:flex-row sm:items-center sm:justify-between">
            <span>Keep the original detail. Tailoring happens later.</span>
            <span className="flex items-center gap-3">
              <DevSampleFill disabled={isPending} onFill={(sample) => setDraft(sample.resume)} />
              <span id="resume-counter">{draft.length.toLocaleString()} / {MAX_CHARACTERS.toLocaleString()} characters</span>
            </span>
          </div>
          <label className="sr-only" htmlFor="master-resume-editor">
            Full, unedited career experience
          </label>
          <ScrollRegion className="max-h-[50dvh]">
            <HorizonTextarea
              aria-describedby="resume-counter resume-storage-note"
              aria-invalid={error ? true : undefined}
              className="min-h-80"
              disabled={isPending}
              id="master-resume-editor"
              maxLength={MAX_CHARACTERS}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={"PROFESSIONAL SUMMARY\nWrite a concise overview of your experience.\n\nEXPERIENCE\nRole | Company | Dates\nDescribe your work and measurable achievements.\n\nSKILLS\nList your relevant tools and capabilities."}
              value={draft}
            />
          </ScrollRegion>
          <p className="flex items-start gap-2 text-xs leading-5 text-horizon-muted" id="resume-storage-note">
            <LockKeyhole aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-horizon-secondary" />
            <span>Your master resume is stored privately. Generated resumes, job descriptions, and PDFs are not stored.</span>
          </p>
        </div>
      </HorizonDialog>
    </AuthenticatedAppShell>
  );
}
