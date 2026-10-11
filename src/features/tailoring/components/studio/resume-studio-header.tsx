"use client";

import { useState, type RefObject } from "react";
import Link from "next/link";
import { ArrowLeft, Download, LoaderCircle, Sparkles } from "lucide-react";

import { AccountBar } from "@/components/horizon/account-bar";
import { BrandMark } from "@/components/brand-mark";
import { readJobTarget } from "@/features/tailoring/lib/read-job-target";
import { downloadOptimizedResumePdf } from "@/features/tailoring/pdf/download-resume-pdf";
import type { OptimizedResume } from "@/features/tailoring/lib/types";
import type { AuthUser } from "@/server/auth/types";
import type { TemplateId } from "@/templates/registry";

export function ResumeStudioHeader({
  resume,
  jobDescription,
  isPending,
  isReady,
  headingRef,
  mode,
  user,
  templateId = "minimal",
}: {
  resume?: OptimizedResume;
  jobDescription: string;
  isPending: boolean;
  isReady: boolean;
  headingRef: RefObject<HTMLHeadingElement | null>;
  mode: "guest" | "account";
  user?: AuthUser;
  templateId?: TemplateId;
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const target = readJobTarget(jobDescription);
  const roleLabel = jobDescription.trim()
    ? target.company === "Company not listed"
      ? target.title
      : `${target.title} (${target.company})`
    : "New tailored résumé";

  const handleDownload = async () => {
    if (!resume) return;
    setDownloadError(null);
    setIsDownloading(true);
    try {
      await downloadOptimizedResumePdf(resume, undefined, templateId);
    } catch (error: unknown) {
      setDownloadError(
        error instanceof Error ? error.message : "Your PDF could not be created. Please try again.",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const studioActions = (
    <>
      <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 sm:inline-flex">
        <span aria-hidden className="size-1.5 rounded-full bg-emerald-500" />
        {isPending ? "Tailoring" : resume ? "Draft Ready" : "Studio Ready"}
      </span>

      <button
        type="submit"
        disabled={isPending || !isReady}
        aria-label={resume ? "Refine with AI" : "Tailor my résumé"}
        className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary disabled:pointer-events-none disabled:opacity-45"
      >
        {isPending ? (
          <LoaderCircle aria-hidden className="size-3.5 animate-spin motion-reduce:animate-none" />
        ) : (
          <Sparkles aria-hidden className="size-3.5" />
        )}
        <span className="hidden sm:inline">{resume ? "Refine with AI" : "Tailor my résumé"}</span>
      </button>

      <button
        type="button"
        onClick={handleDownload}
        disabled={isDownloading || !resume}
        aria-label="Download PDF"
        className="horizon-button-primary h-9 px-4 text-xs disabled:pointer-events-none disabled:opacity-45"
      >
        {isDownloading ? (
          <LoaderCircle aria-hidden className="size-3.5 animate-spin motion-reduce:animate-none" />
        ) : (
          <Download aria-hidden className="size-3.5" />
        )}
        <span className="hidden sm:inline">Download PDF</span>
      </button>
    </>
  );

  if (mode === "account" && user) {
    return (
      <>
        <AccountBar
          user={user}
          title={roleLabel}
          headingId="studio-target-heading"
          headingRef={headingRef}
          actions={
            <>
              <Link
                href="/dashboard"
                aria-label="Master résumé"
                className="inline-flex h-9 items-center gap-1.5 rounded-full px-2 text-xs font-semibold text-slate-600 hover:text-horizon-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary"
              >
                <ArrowLeft aria-hidden className="size-3.5" />
                <span className="hidden md:inline">Master résumé</span>
              </Link>
              {studioActions}
            </>
          }
        />
        {downloadError ? (
          <div role="alert" className="border-b border-red-200 bg-red-50 px-6 py-2 text-xs font-medium text-red-800">
            {downloadError}
          </div>
        ) : null}
      </>
    );
  }

  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            aria-label="Opti home"
            className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-primary focus-visible:ring-offset-2"
          >
            <BrandMark />
          </Link>
          <span aria-hidden className="h-4 w-px shrink-0 bg-slate-200" />
          <h1
            id="studio-target-heading"
            ref={headingRef}
            tabIndex={-1}
            className="truncate text-sm font-medium text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary"
          >
            {roleLabel}
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/login"
            className="mr-1 hidden items-center text-xs font-semibold text-slate-600 hover:text-horizon-primary sm:inline-flex"
          >
            Sign in
          </Link>
          {studioActions}
        </div>
      </header>

      {downloadError ? (
        <div
          role="alert"
          className="border-b border-red-200 bg-red-50 px-6 py-2 text-xs font-medium text-red-800"
        >
          {downloadError}
        </div>
      ) : null}
    </>
  );
}
