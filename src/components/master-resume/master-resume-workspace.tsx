"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ArrowRight, CheckCircle2, FileText, LoaderCircle, LockKeyhole, Pencil, ShieldCheck, Sparkles } from "lucide-react";

import { saveMasterResume } from "@/app/actions/master-resume";
import { AuthenticatedAppShell } from "@/components/horizon/authenticated-app-shell";
import { ActionGroup, ContentContainer, DocumentPreviewCard, HorizonDialog, PageHeader } from "@/components/horizon/page-composition";
import { HorizonBadge, HorizonButton, HorizonSurface, HorizonTextarea } from "@/components/horizon";
import type { AuthUser } from "@/server/auth/types";

interface MasterResumeWorkspaceProps {
  user: AuthUser;
  initialContent?: string;
  initialUpdatedAt?: string;
}

export function MasterResumeWorkspace({ user, initialContent = "", initialUpdatedAt }: MasterResumeWorkspaceProps) {
  const [content, setContent] = useState(initialContent);
  const [savedContent, setSavedContent] = useState(initialContent);
  const [lastSavedAt, setLastSavedAt] = useState<string | undefined>(initialUpdatedAt);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSavedRecently, setIsSavedRecently] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isSetup = savedContent.trim().length > 0;
  const isDirty = content !== savedContent;

  const openEditor = () => {
    setContent(savedContent);
    setError(null);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    if (isPending) return;
    setContent(savedContent);
    setError(null);
    setIsEditorOpen(false);
  };

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      const result = await saveMasterResume(content);
      if (!result.ok) {
        setError(result.error.message);
        return;
      }

      setSavedContent(content);
      setLastSavedAt(new Date(result.data.updatedAt).toLocaleTimeString());
      setIsSavedRecently(true);
      setIsEditorOpen(false);
      window.setTimeout(() => setIsSavedRecently(false), 3000);
    });
  };

  const updatedLabel = lastSavedAt ? `Updated ${lastSavedAt}` : "Saved to your account";

  return (
    <AuthenticatedAppShell user={user} title="Master résumé">
      <ContentContainer className="py-6 sm:py-8 lg:py-10" size="wide">
        <PageHeader
          actions={isSetup ? <Link className="horizon-button-primary px-5" href="/dashboard/generator"><Sparkles aria-hidden="true" className="size-4" />Tailor for a role<ArrowRight aria-hidden="true" className="size-4" /></Link> : undefined}
          description={isSetup ? "Your saved source stays factual while each tailored résumé is created for a specific role." : "Save your source once, then use it to create focused résumés for the roles you want."}
          eyebrow={<HorizonBadge>{isSetup ? "Source document" : "Get started"}</HorizonBadge>}
          title={isSetup ? "Your master résumé" : "Set up your master résumé"}
        />

        <div className="mt-8 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-6">
          {isSetup ? (
            <DocumentPreviewCard
              action={<HorizonButton onClick={openEditor} tone="secondary" type="button"><Pencil aria-hidden="true" className="size-4" />Edit master résumé</HorizonButton>}
              metadata={<span className="flex flex-wrap items-center gap-x-2 gap-y-1"><span className="inline-flex items-center gap-1 text-green-700"><CheckCircle2 aria-hidden="true" className="size-3.5" />Saved</span><span aria-hidden="true">·</span><span>{updatedLabel}</span><span aria-hidden="true">·</span><span>{savedContent.length.toLocaleString()} characters</span></span>}
              summary="A concise overview of the factual document Opti uses for every tailored application."
              title="Master résumé"
            />
          ) : (
            <HorizonSurface className="p-5 sm:p-7">
              <span aria-hidden="true" className="inline-flex size-11 items-center justify-center rounded-full bg-horizon-primary/10 text-horizon-primary"><FileText className="size-5" /></span>
              <h2 className="mt-5 text-horizon-heading font-bold text-horizon-ink">Add your master résumé</h2>
              <p className="mt-2 max-w-xl text-horizon-body leading-6 text-horizon-muted">Start with the complete version of your experience. You can keep it current whenever your work changes.</p>
              <HorizonButton className="mt-6" onClick={openEditor} type="button"><Pencil aria-hidden="true" className="size-4" />Add master résumé</HorizonButton>
            </HorizonSurface>
          )}

          <HorizonSurface className="p-5 sm:p-6">
            <ShieldCheck aria-hidden="true" className="size-6 text-horizon-secondary" />
            <h2 className="mt-4 text-horizon-heading font-bold text-horizon-ink">Your data stays private</h2>
            <p className="mt-2 text-horizon-body leading-6 text-horizon-muted">Your source document is stored privately on your account. Job descriptions, generated résumés, and PDFs are not stored.</p>
            <div className="mt-5 border-t border-horizon-outline/15 pt-4">
              <p className="text-horizon-meta font-bold uppercase tracking-[0.14em] text-horizon-muted">One factual source</p>
              <p className="mt-2 text-horizon-body leading-6 text-horizon-muted">Tailoring never changes the original document you control.</p>
            </div>
          </HorizonSurface>
        </div>

        <div aria-atomic="true" aria-live="polite" className="mt-4">
          {isSavedRecently ? <p className="inline-flex items-center gap-2 text-sm font-bold text-green-700"><CheckCircle2 aria-hidden="true" className="size-4" />Changes saved</p> : null}
        </div>
      </ContentContainer>

      <HorizonDialog
        description="Keep the original detail here. Tailoring happens later."
        footer={<ActionGroup className="sm:justify-end"><HorizonButton disabled={isPending} onClick={closeEditor} tone="secondary" type="button">Cancel</HorizonButton><HorizonButton disabled={isPending || !content.trim() || !isDirty} onClick={handleSave} type="button">{isPending ? <><LoaderCircle aria-hidden="true" className="size-4 animate-spin" />Saving…</> : "Save changes"}</HorizonButton></ActionGroup>}
        isOpen={isEditorOpen}
        onClose={closeEditor}
        title={isSetup ? "Edit master résumé" : "Add your master résumé"}
      >
        <div className="space-y-4">
          <label className="block text-sm font-bold text-horizon-ink" htmlFor="master-resume-editor">Full, unedited career experience</label>
          <HorizonTextarea aria-describedby="resume-counter resume-storage-note" disabled={isPending} id="master-resume-editor" maxLength={50_000} onChange={(event) => setContent(event.target.value)} placeholder="Paste your complete résumé here — work history, education, skills, projects, and measurable achievements." value={content} />
          <div className="flex flex-wrap items-center justify-between gap-2 text-horizon-meta font-medium text-horizon-muted">
            <span id="resume-storage-note" className="inline-flex items-center gap-2"><LockKeyhole aria-hidden="true" className="size-3.5 text-horizon-secondary" />Stored privately on your authenticated account.</span>
            <span id="resume-counter" className="font-mono">{content.length.toLocaleString()} / 50,000 characters</span>
          </div>
          {error ? <p className="rounded-[var(--horizon-radius-control)] border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800" role="alert">{error}</p> : null}
        </div>
      </HorizonDialog>
    </AuthenticatedAppShell>
  );
}
