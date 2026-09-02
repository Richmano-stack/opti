"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, CheckCircle2, FileText, LoaderCircle, LockKeyhole, LogOut, Save, ShieldCheck, Sparkles } from "lucide-react";

import { saveMasterResume } from "@/app/actions/master-resume";
import { BrandMark } from "@/components/landing/brand-mark";
import { authClient } from "@/server/auth/client";
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
  const router = useRouter();
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

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <div className="horizon-page relative min-h-screen overflow-hidden text-horizon-ink">
      <div className="horizon-aurora" aria-hidden="true">
        <div className="horizon-orb horizon-orb-primary" />
        <div className="horizon-orb horizon-orb-secondary" />
        <div className="horizon-orb horizon-orb-tertiary" />
      </div>

      <header className="sticky top-0 z-20 px-4 pt-4 sm:px-6 sm:pt-6">
        <nav aria-label="Account navigation" className="horizon-glass mx-auto flex max-w-[108rem] items-center justify-between rounded-full px-4 py-2.5 sm:px-5">
          <Link href="/dashboard" aria-label="Opti dashboard" className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-primary focus-visible:ring-offset-2">
            <BrandMark />
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-bold text-horizon-ink">{user.name || user.email}</p>
              <p className="text-[10px] text-horizon-muted">{user.email}</p>
            </div>
            <button type="button" onClick={handleSignOut} className="horizon-button-ghost h-10 px-3 text-xs sm:px-4">
              <LogOut aria-hidden="true" className="size-3.5" />
              <span className="hidden sm:inline">Sign out</span>
              <span className="sr-only sm:hidden">Sign out</span>
            </button>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-16 pt-12 sm:px-8 sm:pt-16 lg:px-16 lg:pb-24">
        <section aria-labelledby="dashboard-title" className="max-w-4xl">
          <span className="horizon-eyebrow">{isSetup ? "Source resume ready" : "Set up your source resume"}</span>
          <h1 id="dashboard-title" className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
            {isSetup ? "Your master resume" : "Your factual source of truth"}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-horizon-muted sm:text-lg sm:leading-8">
            Save it once. Update it whenever your experience changes. Opti uses only this source to ground every tailored resume in facts you control.
          </p>
        </section>

        <div className="mt-10 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-8">
          <section aria-labelledby="editor-title" className="horizon-glass overflow-hidden rounded-2xl">
            <div className="flex flex-col gap-3 border-b border-white/70 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-horizon-primary/10 text-horizon-primary"><FileText aria-hidden="true" className="size-5" /></span>
                <div>
                  <h2 id="editor-title" className="text-base font-bold tracking-[-0.01em]">Master resume document</h2>
                  <p className="text-xs text-horizon-muted">Plain text · up to 50,000 characters</p>
                </div>
              </div>
              {lastSavedAt ? <p className="flex items-center gap-1.5 text-xs font-semibold text-horizon-muted"><CheckCircle2 aria-hidden="true" className="size-3.5 text-[#16872a]" />Last saved at {lastSavedAt}</p> : null}
            </div>

            <div className="p-4 sm:p-6">
              <label htmlFor="master-resume-editor" className="sr-only">Full, unedited career experience</label>
              <textarea
                id="master-resume-editor"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Paste your complete resume here — work history, education, skills, projects, and measurable achievements."
                maxLength={50_000}
                disabled={isPending}
                aria-describedby="resume-counter resume-storage-note"
                className="min-h-[28rem] w-full resize-y rounded-2xl border border-white/80 bg-white/55 p-5 text-sm leading-7 text-horizon-ink shadow-inner shadow-black/[0.02] outline-none transition placeholder:text-horizon-muted/65 focus:border-horizon-secondary/45 focus:ring-2 focus:ring-horizon-secondary/20 disabled:cursor-wait disabled:opacity-70 sm:min-h-[32rem] sm:p-6 sm:text-base"
              />
              <div className="mt-3 flex items-center justify-between gap-4 text-[11px] font-semibold text-horizon-muted">
                <span>Keep the original detail. Tailoring happens later.</span>
                <span id="resume-counter" className="shrink-0 font-mono">{content.length.toLocaleString()} / 50,000 characters</span>
              </div>

              <div aria-live="polite" aria-atomic="true">
                {isSavedRecently ? <p className="mt-4 flex items-center gap-2 rounded-xl border border-[#27c93f]/20 bg-[#27c93f]/10 px-4 py-3 text-sm font-bold text-[#116f20]"><Check aria-hidden="true" className="size-4" />Your master resume is saved.</p> : null}
              </div>
              {error ? <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</p> : null}

              <div className="mt-6 flex flex-col gap-4 border-t border-white/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2 text-xs leading-5 text-horizon-muted"><LockKeyhole aria-hidden="true" className="size-4 shrink-0 text-horizon-secondary" />Stored privately on your authenticated account.</p>
                <button type="button" onClick={handleSave} disabled={isPending || !content.trim() || (!isDirty && isSetup)} className="horizon-button-primary h-11 w-full px-6 text-sm disabled:pointer-events-none disabled:opacity-45 sm:w-auto">
                  {isPending ? <><LoaderCircle aria-hidden="true" className="size-4 animate-spin" />Saving…</> : <><Save aria-hidden="true" className="size-4" />{isSetup ? "Save changes" : "Save master resume"}</>}
                </button>
              </div>
            </div>
          </section>

          <aside aria-label="How Opti handles your resume" className="space-y-4 lg:sticky lg:top-28">
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
        </div>
      </main>
    </div>
  );
}
