"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ArrowRight, CheckCircle2, FileText, LoaderCircle, LockKeyhole, Pencil, ShieldCheck, Sparkles } from "lucide-react";

import { saveMasterResume } from "@/app/actions/master-resume";
import { AuthenticatedAppShell } from "@/components/horizon/authenticated-app-shell";
import { ActionGroup, ContentContainer, HorizonDialog } from "@/components/horizon/page-composition";
import { HorizonBadge, HorizonButton, HorizonSurface, HorizonTextarea } from "@/components/horizon";
import type { AuthUser } from "@/server/auth/types";

interface MasterResumeWorkspaceProps {
  user: AuthUser;
  initialContent?: string;
  initialUpdatedAt?: string;
}

function ResumeMockup() {
  return (
    <div aria-label="Document preview" className="rounded-[var(--horizon-radius-control)] border border-horizon-outline/10 bg-white p-5 shadow-sm sm:p-6">
      <div className="h-2.5 w-2/5 rounded-full bg-horizon-ink/70" />
      <div className="mt-3 h-2 w-1/3 rounded-full bg-horizon-ink/10" />
      <div className="mt-6 space-y-3">
        <div className="h-1.5 w-1/4 rounded-full bg-horizon-primary/60" />
        <div className="space-y-2"><div className="h-2 w-full rounded-full bg-horizon-ink/10" /><div className="h-2 w-11/12 rounded-full bg-horizon-ink/10" /><div className="h-2 w-4/5 rounded-full bg-horizon-ink/10" /></div>
        <div className="h-1.5 w-1/4 rounded-full bg-horizon-primary/60" />
        <div className="space-y-2"><div className="h-2 w-full rounded-full bg-horizon-ink/10" /><div className="h-2 w-5/6 rounded-full bg-horizon-ink/10" /><div className="h-2 w-2/3 rounded-full bg-horizon-ink/10" /></div>
      </div>
    </div>
  );
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
      <ContentContainer className="max-w-5xl py-6 sm:py-8 lg:py-12" size="wide">
        <section aria-labelledby="dashboard-title" className="max-w-3xl">
          <HorizonBadge>{isSetup ? "Your source document" : "Get started"}</HorizonBadge>
          <h1 id="dashboard-title" className="mt-4 text-xl font-bold tracking-[-0.03em] text-horizon-ink sm:text-2xl">{isSetup ? "Your master résumé is the foundation for every application." : "Set up your master résumé once, then tailor from it with confidence."}</h1>
        </section>

        <div className="mt-6">
          {isSetup ? (
            <HorizonSurface className="overflow-hidden">
              <div className="p-5 sm:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div><h2 className="text-horizon-title font-bold tracking-[-0.035em] text-horizon-ink">Master résumé</h2><div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-horizon-body text-horizon-muted"><span className="inline-flex items-center gap-1 font-bold text-green-700"><CheckCircle2 aria-hidden="true" className="size-4" />Saved</span><span aria-hidden="true">·</span><span>{updatedLabel}</span><span aria-hidden="true">·</span><span>{savedContent.length.toLocaleString()} characters</span></div></div>
                  <HorizonButton onClick={openEditor} tone="secondary" type="button"><Pencil aria-hidden="true" className="size-4" />Edit master résumé</HorizonButton>
                </div>
                <div className="mt-6 grid items-center gap-6 md:grid-cols-[18rem_minmax(0,1fr)] md:gap-8">
                  <ResumeMockup />
                  <div className="space-y-3"><p className="text-horizon-heading font-bold text-horizon-ink">Your factual source document</p><p className="text-horizon-body leading-6 text-horizon-muted">Opti uses this source to create focused versions for specific roles, without changing what is here.</p></div>
                </div>
              </div>
              <Link className="flex min-h-20 items-center justify-between gap-5 bg-horizon-primary px-5 py-5 text-white transition hover:bg-horizon-primary/90 sm:px-7" href="/dashboard/generator">
                <span className="flex items-center gap-4"><Sparkles aria-hidden="true" className="size-6 shrink-0 text-horizon-inverse-primary" /><span><span className="block text-lg font-bold">Tailor for a role</span><span className="mt-1 block text-sm text-white/80">Create a focused version without changing your source.</span></span></span><ArrowRight aria-hidden="true" className="size-5 shrink-0" />
              </Link>
            </HorizonSurface>
          ) : (
            <HorizonSurface className="p-5 sm:p-7">
              <span aria-hidden="true" className="inline-flex size-11 items-center justify-center rounded-full bg-horizon-primary/10 text-horizon-primary"><FileText className="size-5" /></span>
              <h2 className="mt-5 text-horizon-heading font-bold text-horizon-ink">Add your master résumé</h2>
              <p className="mt-2 max-w-xl text-horizon-body leading-6 text-horizon-muted">Start with the complete version of your experience. You can keep it current whenever your work changes.</p>
              <HorizonButton className="mt-6" onClick={openEditor} type="button"><Pencil aria-hidden="true" className="size-4" />Add master résumé</HorizonButton>
            </HorizonSurface>
          )}
        </div>

        <p className="mt-5 flex items-start justify-center gap-2 text-center text-horizon-body leading-6 text-horizon-muted"><ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-horizon-secondary" />Only your master résumé is saved. Job descriptions and tailored files stay temporary.</p>

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
