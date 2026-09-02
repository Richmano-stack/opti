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
      <div className="flex flex-col gap-4 rounded-2xl border border-horizon-secondary/15 bg-horizon-secondary/7 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-horizon-muted">
          Your PDF is generated in this browser and is not saved by Opti.
        </p>
        <Button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="h-10 shrink-0 rounded-full bg-horizon-primary px-5 text-xs font-bold text-white hover:bg-[#8b1a00] focus-visible:ring-horizon-primary"
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
          className="rounded-2xl border border-red-200 bg-red-50/80 p-4 text-xs font-medium text-red-800"
        >
          {downloadError}
        </p>
      ) : null}
      <GuestResumePreview resume={resume} />
    </div>
  );
}
