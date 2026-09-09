"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, Check, CheckCircle2, FileText, LoaderCircle, LockKeyhole, Save, Sparkles } from "lucide-react";

import { saveMasterResume } from "@/app/actions/master-resume";
import { AuthenticatedAppShell } from "@/components/horizon/authenticated-app-shell";
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
  const [error, setError] = useState<string | null>(null);
  const [isSavedRecently, setIsSavedRecently] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isDirty = content !== savedContent;
  const isSetup = savedContent.length > 0;

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      const result = await saveMasterResume(content);
      if (result.ok) {
        setSavedContent(content);
        setLastSavedAt(new Date(result.data.updatedAt).toLocaleTimeString());
        setIsSavedRecently(true);
        setTimeout(() => setIsSavedRecently(false), 3000);
      } else {
        setError(result.error.message);
      }
    });
  };

  const sidebarUtility = isSetup ? (
    <aside aria-label="Resume next step" className="border-t border-horizon-outline/15 pt-5">
      <Sparkles aria-hidden="true" className="size-5 text-horizon-primary" />
      <h2 className="mt-3 text-sm font-bold">Ready for a role?</h2>
      <p className="mt-1.5 text-xs leading-5 text-horizon-muted">Tailor this source resume to a job description.</p>
      <Link href="/dashboard/generator" className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-[var(--horizon-radius-control)] bg-horizon-ink px-3 text-xs font-bold text-white transition hover:bg-horizon-ink/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary">
        Continue to tailoring <ArrowRight aria-hidden="true" className="size-3.5" />
      </Link>
    </aside>
  ) : (
    <aside aria-label="Resume next step" className="border-t border-horizon-outline/15 pt-5">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-horizon-primary">First step</p>
      <p className="mt-2 text-xs leading-5 text-horizon-muted">Save your source resume to unlock tailoring.</p>
    </aside>
  );

  return (
    <AuthenticatedAppShell user={user} title="Master résumé" sidebarUtility={sidebarUtility}>
      <section aria-labelledby="editor-title" className="flex min-h-[calc(100dvh-8rem)] min-w-0 flex-col bg-white lg:h-full lg:min-h-0">
            <div aria-label="Document toolbar" role="toolbar" className="flex shrink-0 flex-col gap-3 border-b border-horizon-outline/15 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-horizon-primary/10 text-horizon-primary"><FileText aria-hidden="true" className="size-4" /></span>
                <div className="min-w-0">
                  <h1 id="editor-title" className="truncate text-sm font-bold tracking-[-0.01em]">Master résumé</h1>
                  <p className="text-xs text-horizon-muted">{isSetup ? "Your source document" : "Set up your source resume"}</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 sm:justify-end">
                {lastSavedAt ? <p className="flex items-center gap-1.5 text-xs font-semibold text-horizon-muted"><CheckCircle2 aria-hidden="true" className="size-3.5 text-[#16872a]" />Last saved at {lastSavedAt}</p> : null}
                <button type="button" onClick={handleSave} disabled={isPending || !content.trim() || (!isDirty && isSetup)} className="horizon-button-primary h-10 shrink-0 px-5 text-sm disabled:pointer-events-none disabled:opacity-45">
                  {isPending ? <><LoaderCircle aria-hidden="true" className="size-4 animate-spin" />Saving…</> : <><Save aria-hidden="true" className="size-4" />{isSetup ? "Save changes" : "Save master resume"}</>}
                </button>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-1 border-b border-horizon-outline/10 bg-white/80 px-4 py-2 text-[11px] font-semibold text-horizon-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <span>Keep the original detail. Tailoring happens later.</span>
              <span id="resume-counter" className="shrink-0 font-mono">{content.length.toLocaleString()} / 50,000 characters</span>
            </div>

            <div aria-label="Document canvas" className="min-h-0 flex-1 overflow-y-auto bg-horizon-canvas px-3 py-5 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
              <div aria-live="polite" aria-atomic="true">
                {isSavedRecently ? <p className="mx-auto mb-4 flex max-w-[52rem] items-center gap-2 rounded-lg border border-[#27c93f]/20 bg-[#27c93f]/10 px-4 py-3 text-sm font-bold text-[#116f20]"><Check aria-hidden="true" className="size-4" />Your master resume is saved.</p> : null}
              </div>
              {error ? <p role="alert" className="mx-auto mb-4 max-w-[52rem] rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</p> : null}

              <label htmlFor="master-resume-editor" className="sr-only">Full, unedited career experience</label>
              <textarea
                id="master-resume-editor"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Start your master resume here…\n\nPROFESSIONAL SUMMARY\nWrite a concise overview of your experience.\n\nEXPERIENCE\nRole | Company | Dates\nDescribe your work and measurable achievements.\n\nSKILLS\nList your relevant tools and capabilities."
                maxLength={50_000}
                disabled={isPending}
                aria-describedby="resume-counter resume-storage-note"
                className="mx-auto block min-h-[calc(100dvh-15rem)] w-full max-w-[52rem] resize-none rounded-sm border border-horizon-outline/20 bg-white px-6 py-8 text-sm leading-7 text-horizon-ink shadow-[0_3px_18px_rgba(31,25,22,0.10)] outline-none transition placeholder:text-horizon-muted/55 focus:border-horizon-secondary/50 focus:ring-2 focus:ring-horizon-secondary/20 disabled:cursor-wait disabled:opacity-70 sm:min-h-[64rem] sm:px-12 sm:py-12 sm:text-base"
              />

              <p id="resume-storage-note" className="mx-auto mt-4 flex max-w-[52rem] items-start gap-2 text-xs leading-5 text-horizon-muted"><LockKeyhole aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-horizon-secondary" /><span>Your master resume is stored privately. Generated resumes, job descriptions, and PDFs are not stored.</span></p>
            </div>
      </section>
    </AuthenticatedAppShell>
  );
}








