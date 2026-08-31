"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  ArrowRight,
  Check,
  FileText,
  LoaderCircle,
  Lock,
  LogOut,
  Save,
  Sparkles,
} from "lucide-react";

import { saveMasterResume } from "@/app/actions/master-resume";
import { Button } from "@/components/ui/button";
import type { AuthUser } from "@/server/auth/types";
import { authClient } from "@/server/auth/client";
import { useRouter } from "next/navigation";

// Opti Sparkle Logo
function OptiLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-6 text-brand-ink"
        aria-hidden="true"
      >
        <path d="M12 2C12.5 7.5 16.5 11.5 22 12C16.5 12.5 12.5 16.5 12 22C11.5 16.5 7.5 12.5 2 12C7.5 11.5 11.5 7.5 12 2Z" />
      </svg>
      <span className="text-xl font-bold tracking-tight text-slate-900">Opti</span>
    </div>
  );
}

interface MasterResumeWorkspaceProps {
  user: AuthUser;
  initialContent?: string;
  initialUpdatedAt?: string;
}

export function MasterResumeWorkspace({
  user,
  initialContent = "",
  initialUpdatedAt,
}: MasterResumeWorkspaceProps) {
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
    <div className="page-sky-gradient min-h-screen text-slate-900 antialiased selection:bg-brand-soft selection:text-slate-800">
      {/* Top Navigation */}
      <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/dashboard" className="transition-opacity hover:opacity-90">
            <OptiLogo />
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden sm:flex flex-col items-end text-xs">
              <span className="font-semibold text-slate-800">{user.name || user.email}</span>
              <span className="text-slate-500">{user.email}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="text-xs gap-1.5 text-slate-600 hover:text-slate-900"
            >
              <LogOut className="size-3.5" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Header Title Section */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-brand-soft px-3 py-0.5 text-xs font-semibold text-brand-ink border border-brand-border">
                {isSetup ? "Master resume active" : "First-time setup"}
              </span>
              {isSavedRecently ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 animate-fade-in">
                  <Check className="size-3" /> Saved
                </span>
              ) : null}
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {isSetup ? "Your Master Resume" : "Save your master resume"}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl">
              Opti uses your master resume as the factual foundation for every job you apply to.
              Save it once, and tailor it in seconds.
            </p>
          </div>

          {isSetup ? (
            <div className="pt-2 sm:pt-0">
              <Link href="/dashboard/generator">
                <Button className="w-full sm:w-auto bg-brand-action hover:bg-brand-action-hover text-slate-900 font-semibold text-xs h-10 px-4 rounded-xl shadow-sm shadow-sky-200/20 gap-2">
                  <Sparkles className="size-4" />
                  Tailor for a role
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </div>
          ) : null}
        </div>

        {/* Editor Card */}
        <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <FileText className="size-4 text-brand-ink" />
              <span>Full, unedited career experience</span>
            </div>
            {lastSavedAt ? (
              <span className="text-[11px] text-slate-400">Last saved at {lastSavedAt}</span>
            ) : null}
          </div>

          <div className="relative rounded-xl border border-slate-200 bg-[#fbfcfe] p-1 focus-within:border-brand-muted focus-within:ring-2 focus-within:ring-brand-muted/30 transition-all">
            <textarea
              id="master-resume-editor"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your standard master resume with your work history, skills, education, and achievements here..."
              maxLength={50_000}
              disabled={isPending}
              className="w-full min-h-[320px] resize-y bg-transparent p-4 text-xs leading-relaxed text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>Plain text only</span>
            <span className="font-mono">{content.length.toLocaleString()} / 50,000 characters</span>
          </div>

          {error ? (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100">
              {error}
            </p>
          ) : null}

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Lock className="size-3.5 text-slate-400" />
              <span>Saved to your account and never used in guest sessions.</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                onClick={handleSave}
                disabled={isPending || !content.trim() || (!isDirty && isSetup)}
                className="w-full sm:w-auto h-10 px-5 rounded-xl bg-brand-action hover:bg-brand-action-hover text-slate-900 font-semibold text-xs shadow-sm shadow-sky-200/20 gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <LoaderCircle className="size-3.5 animate-spin" />
                    Saving
                  </>
                ) : (
                  <>
                    <Save className="size-3.5" />
                    {isSetup ? "Save changes" : "Save master resume"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
