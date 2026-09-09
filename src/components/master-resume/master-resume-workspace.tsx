"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, Check, CheckCircle2, FileText, LoaderCircle, LockKeyhole, Save, ShieldCheck, Sparkles } from "lucide-react";

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

  return (
    <AuthenticatedAppShell user={user} title="Master résumé">
      <main className="mx-auto max-w-[94rem] px-4 py-6 sm:px-8 sm:py-8 lg:px-10">
        <section aria-labelledby="dashboard-title" className="max-w-3xl">
          <span className="horizon-eyebrow">{isSetup ? "Source resume ready" : "Set up your source resume"}</span>
          <h1 id="dashboard-title" className="mt-3 text-3xl font-extrabold leading-tight tracking-[-0.03em] sm:text-4xl">
            {isSetup ? "Your master resume" : "Your factual source of truth"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-horizon-muted sm:text-base">
            Save it once. Update it whenever your experience changes. Opti uses only this source to ground every tailored resume in facts you control.
          </p>
        </section>

        <div className="mt-7 grid items-start gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-7">
          <aside aria-label="How Opti handles your resume" className="order-2 space-y-4 lg:order-1 lg:sticky lg:top-24">
            <div className="horizon-glass rounded-2xl p-6">
              <ShieldCheck aria-hidden="true" className="size-6 text-horizon-secondary" />
              <h2 className="mt-4 text-lg font-bold tracking-[-0.02em]">A focused workspace</h2>
              <ul className="mt-4 space-y-4 text-sm leading-6 text-horizon-muted">
                <li className="flex gap-3"><Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-horizon-primary" />Your master resume is the only source document Opti saves.</li>
                <li className="flex gap-3" id="resume-storage-note"><Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-horizon-primary" />Generated resumes, job descriptions, and PDFs are not stored.</li>
              </ul>
            </div>

            {isSetup ? (
              <div className="rounded-2xl bg-horizon-ink p-6 text-white">
                <Sparkles aria-hidden="true" className="size-6 text-horizon-inverse-primary" />
                <h2 className="mt-4 text-lg font-bold">Ready for a role?</h2>
                <p className="mt-2 text-sm leading-6 text-white/70">Bring a job description and create a tailored resume without changing your source.</p>
                <Link href="/dashboard/generator" className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-horizon-ink transition hover:-translate-y-0.5 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-inverse-primary focus-visible:ring-offset-2 focus-visible:ring-offset-horizon-ink active:scale-95">
                  Continue to tailoring <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-horizon-outline/30 bg-white/25 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-horizon-primary">Next step</p>
                <p className="mt-2 text-sm leading-6 text-horizon-muted">Once this source resume is saved, tailoring becomes available here.</p>
              </div>
            )}
          </aside>

          <section aria-labelledby="editor-title" className="order-1 overflow-hidden rounded-2xl border border-horizon-outline/15 bg-white shadow-sm lg:order-2">
            <div aria-label="Document toolbar" role="toolbar" className="flex flex-col gap-3 border-b border-horizon-outline/15 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-horizon-primary/10 text-horizon-primary"><FileText aria-hidden="true" className="size-4" /></span>
                <div className="min-w-0">
                  <h2 id="editor-title" className="truncate text-sm font-bold tracking-[-0.01em]">Master resume document</h2>
                  <p className="text-xs text-horizon-muted">Plain text · up to 50,000 characters</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 sm:justify-end">
                {lastSavedAt ? <p className="flex items-center gap-1.5 text-xs font-semibold text-horizon-muted"><CheckCircle2 aria-hidden="true" className="size-3.5 text-[#16872a]" />Last saved at {lastSavedAt}</p> : null}
                <button type="button" onClick={handleSave} disabled={isPending || !content.trim() || (!isDirty && isSetup)} className="horizon-button-primary h-10 shrink-0 px-5 text-sm disabled:pointer-events-none disabled:opacity-45">
                  {isPending ? <><LoaderCircle aria-hidden="true" className="size-4 animate-spin" />Saving…</> : <><Save aria-hidden="true" className="size-4" />{isSetup ? "Save changes" : "Save master resume"}</>}
                </button>
              </div>
            </div>

            <div className="bg-horizon-canvas/70 p-3 sm:p-6 lg:p-8">
              <div aria-live="polite" aria-atomic="true">
                {isSavedRecently ? <p className="mx-auto mb-4 flex max-w-[52rem] items-center gap-2 rounded-xl border border-[#27c93f]/20 bg-[#27c93f]/10 px-4 py-3 text-sm font-bold text-[#116f20]"><Check aria-hidden="true" className="size-4" />Your master resume is saved.</p> : null}
              </div>
              {error ? <p role="alert" className="mx-auto mb-4 max-w-[52rem] rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</p> : null}

              <label htmlFor="master-resume-editor" className="sr-only">Full, unedited career experience</label>
              <textarea
                id="master-resume-editor"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Start your master resume here…\n\nPROFESSIONAL SUMMARY\nWrite a concise overview of your experience.\n\nEXPERIENCE\nRole | Company | Dates\nDescribe your work and measurable achievements.\n\nSKILLS\nList your relevant tools and capabilities."
                maxLength={50_000}
                disabled={isPending}
                aria-describedby="resume-counter resume-storage-note"
                className="mx-auto block min-h-[42rem] w-full max-w-[52rem] resize-y rounded-sm border border-horizon-outline/20 bg-white px-6 py-8 text-sm leading-7 text-horizon-ink shadow-[0_2px_12px_rgba(31,25,22,0.08)] outline-none transition placeholder:text-horizon-muted/55 focus:border-horizon-secondary/50 focus:ring-2 focus:ring-horizon-secondary/20 disabled:cursor-wait disabled:opacity-70 sm:min-h-[52rem] sm:px-12 sm:py-12 sm:text-base"
              />

              <div className="mx-auto mt-3 flex max-w-[52rem] flex-col gap-2 text-[11px] font-semibold text-horizon-muted sm:flex-row sm:items-center sm:justify-between">
                <span>Keep the original detail. Tailoring happens later.</span>
                <span id="resume-counter" className="shrink-0 font-mono">{content.length.toLocaleString()} / 50,000 characters</span>
              </div>
              <p className="mx-auto mt-4 flex max-w-[52rem] items-center gap-2 text-xs leading-5 text-horizon-muted"><LockKeyhole aria-hidden="true" className="size-4 shrink-0 text-horizon-secondary" />Stored privately on your authenticated account.</p>
            </div>
          </section>
        </div>
      </main>
    </AuthenticatedAppShell>
  );
}








