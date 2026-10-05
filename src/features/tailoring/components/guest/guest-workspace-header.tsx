"use client";

import { useState, type RefObject } from "react";
import Link from "next/link";
import { Download, LoaderCircle, Sparkles } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { downloadOptimizedResumePdf } from "@/features/tailoring/pdf/download-resume-pdf";
import { readJobTarget } from "@/features/tailoring/components/guest/source-summary-card";
import type { OptimizedResume } from "@/features/tailoring/lib/types";

export function GuestWorkspaceHeader({
  resume,
  jobDescription,
  isPending,
  isReady,
  headingRef,
}: {
  resume: OptimizedResume;
  jobDescription: string;
  isPending: boolean;
  isReady: boolean;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const target = readJobTarget(jobDescription);
  const roleLabel = target.company === "Company not listed" ? target.title : `${target.title} (${target.company})`;

  const handleDownload = async () => {
    setDownloadError(null);
    setIsDownloading(true);
    try {
      await downloadOptimizedResumePdf(resume);
    } catch {
      setDownloadError("Your PDF could not be created. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Link href="/" aria-label="Opti home" className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-primary focus-visible:ring-offset-2">
          <BrandMark />
        </Link>
        <span aria-hidden className="h-4 w-px shrink-0 bg-slate-200" />
        <h1
          id="guest-result-heading"
          ref={headingRef}
          tabIndex={-1}
          className="truncate text-sm font-medium text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary"
        >
          {roleLabel}
        </h1>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 sm:inline-flex">
          <span aria-hidden className="size-1.5 rounded-full bg-emerald-500" />
          {isPending ? "Tailoring" : "Draft Ready"}
        </span>
        <button
          type="submit"
          disabled={isPending || !isReady}
          className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary disabled:pointer-events-none disabled:opacity-45"
        >
          {isPending ? <LoaderCircle aria-hidden className="size-3.5 animate-spin motion-reduce:animate-none" /> : <Sparkles aria-hidden className="size-3.5" />}
          Refine with AI
        </button>
        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="horizon-button-primary h-9 px-4 text-xs disabled:pointer-events-none disabled:opacity-45"
        >
          {isDownloading ? <LoaderCircle aria-hidden className="size-3.5 animate-spin motion-reduce:animate-none" /> : <Download aria-hidden className="size-3.5" />}
          Download PDF
        </button>
      </div>
    </header>
    {downloadError ? (
      <p role="alert" className="border-b border-red-200 bg-red-50 px-6 py-2 text-xs font-medium text-red-800">
        {downloadError}
      </p>
    ) : null}
    </>
  );
}
