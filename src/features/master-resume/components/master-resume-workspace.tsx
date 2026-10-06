"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, LoaderCircle, LockKeyhole } from "lucide-react";

import { saveMasterResume } from "@/features/master-resume/actions/save-master-resume";
import { AccountBar } from "@/components/horizon/account-bar";
import { ActionGroup, HorizonDialog, ScrollRegion } from "@/components/horizon/page-composition";
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

  const savedLabel = `${isSetup ? "Saved" : "Not saved"}${lastSavedAt ? ` · Last saved at ${lastSavedAt}` : ""} · ${savedContent.length.toLocaleString()} / ${MAX_CHARACTERS.toLocaleString()} characters`;

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-white text-horizon-ink">
      <AccountBar
        user={user}
        title="Master résumé"
        actions={
          isSetup ? (
            <Link href="/dashboard/generator" className="horizon-button-primary h-9 px-4 text-xs">
              Tailor for a role <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          ) : null
        }
      />
      <div className="min-h-0 flex-1 overflow-y-auto bg-slate-100/70">
        <div className="mx-auto flex w-full max-w-[816px] flex-col px-4 py-8 sm:px-0">
          <div aria-live="polite" aria-atomic="true">
            {isSavedRecently ? (
              <p className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
                <CheckCircle2 aria-hidden="true" className="size-4" />
                Your master résumé is saved.
              </p>
            ) : null}
          </div>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-medium text-slate-600">{savedLabel}</p>
            <HorizonButton onClick={openEditor} ref={editButtonRef} tone={isSetup ? "secondary" : "primary"} type="button">
              {editorTitle}
            </HorizonButton>
          </div>
          <article
            aria-label="Master résumé source"
            className="min-h-[900px] rounded-sm border border-slate-200/80 bg-white px-8 py-10 text-sm leading-6 text-[#1c1c1c] shadow-md shadow-slate-300/50 sm:px-14 sm:py-12"
          >
            {isSetup ? (
              <p className="whitespace-pre-wrap">{savedContent}</p>
            ) : (
              <div className="mx-auto flex max-w-md flex-col items-center pt-24 text-center">
                <h2 className="text-lg font-bold tracking-tight text-slate-900">Save one source résumé</h2>
                <p className="mt-2 text-xs leading-5 text-slate-600">
                  Tailoring stays locked until it exists. Add your experience, then tailor it for a role.
                </p>
              </div>
            )}
          </article>
        </div>
      </div>

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
    </div>
  );
}
