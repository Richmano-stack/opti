"use client";

import { useState } from "react";
import { Check, Copy, Download, LoaderCircle } from "lucide-react";

import { GuestResumePreview } from "@/components/guest/guest-resume-preview";
import { Button } from "@/components/ui/button";
import type { OptimizedResume } from "@/services/ai/types";
import { downloadOptimizedResumePdf } from "./download-resume-pdf";
import { formatResumeText } from "./format-resume-text";

export function TailoredResumeResult({ resume }: { resume: OptimizedResume }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopyText = async () => {
    const text = formatResumeText(resume);
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else if (typeof document !== "undefined") {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setHasCopied(true);
      setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    } catch {
      // Degrade silently if clipboard permissions are denied
    }
  };

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
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            type="button"
            onClick={handleCopyText}
            variant="outline"
            className="h-10 shrink-0 rounded-full border border-horizon-secondary/20 bg-white/70 px-4 text-xs font-semibold text-horizon-ink shadow-none hover:bg-white hover:text-horizon-primary focus-visible:ring-horizon-secondary"
          >
            {hasCopied ? (
              <>
                <Check aria-hidden className="size-3.5 text-emerald-600" /> Copied!
              </>
            ) : (
              <>
                <Copy aria-hidden className="size-3.5" /> Copy Text
              </>
            )}
          </Button>
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
