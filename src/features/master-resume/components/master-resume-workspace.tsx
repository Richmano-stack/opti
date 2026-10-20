"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle2, LoaderCircle, LockKeyhole } from "lucide-react";

import { saveMasterResume } from "@/features/master-resume/actions/save-master-resume";
import { AuthenticatedAppShell } from "@/components/horizon/authenticated-app-shell";
import { DevSampleFill } from "@/features/devtools/components/dev-sample-fill";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
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
    <AuthenticatedAppShell
      user={user}
      title="Master résumé"
      actions={
        isSetup ? (
          <Link href="/dashboard/generator" className={buttonVariants()}>
            Tailor for a role <ArrowRight aria-hidden="true" data-icon="inline-end" />
          </Link>
        ) : null
      }
    >
      <div className="min-h-full">
        <div className="mx-auto flex w-full max-w-[816px] flex-col px-4 py-8 sm:px-0">
          <div aria-live="polite" aria-atomic="true">
            {isSavedRecently ? (
              <Alert role="status" className="mb-4">
                <CheckCircle2 aria-hidden="true" />
                <AlertTitle>Your master résumé is saved.</AlertTitle>
              </Alert>
            ) : null}
          </div>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-medium text-muted-foreground">{savedLabel}</p>
            <Button onClick={openEditor} ref={editButtonRef} type="button" size="lg" variant={isSetup ? "outline" : "default"}>
              {editorTitle}
            </Button>
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

      <Dialog
        open={isEditorOpen}
        onOpenChange={(open) => {
          if (!open) requestClose();
        }}
      >
        <DialogContent
          className="max-h-[calc(100dvh-2rem)] grid-rows-[auto_minmax(0,1fr)_auto] sm:max-w-4xl"
          finalFocus={editButtonRef}
          showCloseButton={!isPending}
        >
          <DialogHeader>
            <DialogTitle>{editorTitle}</DialogTitle>
            <DialogDescription>
              This is the only résumé Opti stores. Job descriptions and generated results stay temporary.
            </DialogDescription>
          </DialogHeader>

          <div className="flex min-h-0 flex-col gap-4 overflow-y-auto">
            {error ? (
              <Alert variant="destructive">
                <AlertCircle aria-hidden="true" />
                <AlertTitle>{error}</AlertTitle>
              </Alert>
            ) : null}
            <Field>
              <FieldLabel htmlFor="master-resume-editor" className="sr-only">
                Full, unedited career experience
              </FieldLabel>
              <div className="flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <span>Keep the original detail. Tailoring happens later.</span>
                <span className="flex items-center gap-3">
                  <DevSampleFill disabled={isPending} onFill={(sample) => setDraft(sample.resume)} />
                  <span id="resume-counter">{draft.length.toLocaleString()} / {MAX_CHARACTERS.toLocaleString()} characters</span>
                </span>
              </div>
              <Textarea
                aria-describedby="resume-counter resume-storage-note"
                aria-invalid={error ? true : undefined}
                className="max-h-[50dvh] min-h-80"
                disabled={isPending}
                id="master-resume-editor"
                maxLength={MAX_CHARACTERS}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={"PROFESSIONAL SUMMARY\nWrite a concise overview of your experience.\n\nEXPERIENCE\nRole | Company | Dates\nDescribe your work and measurable achievements.\n\nSKILLS\nList your relevant tools and capabilities."}
                value={draft}
              />
              <FieldDescription id="resume-storage-note" className="flex items-start gap-2 text-xs">
                <LockKeyhole aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                <span>Your master resume is stored privately. Generated resumes, job descriptions, and PDFs are not stored.</span>
              </FieldDescription>
            </Field>
          </div>

          <DialogFooter>
            <Button disabled={isPending} onClick={requestClose} type="button" variant="outline">
              Cancel
            </Button>
            <Button aria-busy={isPending || undefined} disabled={isPending || !canSave} onClick={handleSave} type="button">
              {isPending ? (
                <>
                  <LoaderCircle aria-hidden="true" className="animate-spin" data-icon="inline-start" />
                  Saving…
                </>
              ) : isSetup ? (
                "Save changes"
              ) : (
                "Save master resume"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthenticatedAppShell>
  );
}
