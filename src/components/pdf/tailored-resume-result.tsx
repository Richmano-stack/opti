"use client";

import { useState } from "react";
import { Download, LoaderCircle } from "lucide-react";

import { GuestResumePreview } from "@/components/guest/guest-resume-preview";
import { Button } from "@/components/ui/button";
import type { OptimizedResume } from "@/services/ai/types";
import { downloadOptimizedResumePdf } from "./download-resume-pdf";

export function TailoredResumeResult({ resume }: { resume: OptimizedResume }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

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
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border border-brand-border bg-brand-soft/45 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-slate-600">
          Your PDF is generated in this browser and is not saved by Opti.
        </p>
        <Button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="h-9 shrink-0 rounded-lg px-4 text-xs font-semibold"
        >
          {isDownloading ? (
            <>
              <LoaderCircle aria-hidden className="size-4 animate-spin" /> Creating PDF…
            </>
          ) : (
            <>
              <Download aria-hidden className="size-4" /> Download PDF
            </>
          )}
        </Button>
      </div>
      {downloadError ? (
        <p
          role="alert"
          className="rounded-lg border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-600"
        >
          {downloadError}
        </p>
      ) : null}
      <GuestResumePreview resume={resume} />
    </div>
  );
}
