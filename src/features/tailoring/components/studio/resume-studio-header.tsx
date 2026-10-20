"use client";

import { useState, type RefObject } from "react";
import Link from "next/link";
import { AlertCircle, Download } from "lucide-react";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { BrandMark } from "@/components/brand-mark";
import { cn } from "@/lib/utils";
import { readJobTarget } from "@/features/tailoring/lib/read-job-target";
import { downloadOptimizedResumePdf } from "@/features/tailoring/pdf/download-resume-pdf";
import type { OptimizedResume } from "@/features/tailoring/lib/types";
import type { TemplateId } from "@/templates/registry";

export function studioRoleLabel(jobDescription: string): string {
  if (!jobDescription.trim()) return "New tailored résumé";
  const target = readJobTarget(jobDescription);
  return target.company === "Company not listed" ? target.title : `${target.title} (${target.company})`;
}

export function useResumeDownload(resume: OptimizedResume | undefined, templateId: TemplateId) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const download = async () => {
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

  return { isDownloading, downloadError, download };
}

export function StudioHeading({
  label,
  headingRef,
  className,
}: {
  label: string;
  headingRef: RefObject<HTMLHeadingElement | null>;
  className?: string;
}) {
  return (
    <h1
      id="studio-target-heading"
      ref={headingRef}
      tabIndex={-1}
      className={cn(
        "min-w-0 truncate text-sm outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary",
        className,
      )}
    >
      {label}
    </h1>
  );
}

export function StudioActions({
  resume,
  isPending,
  isDownloading,
  onDownload,
  className,
}: {
  resume?: OptimizedResume;
  isPending: boolean;
  isDownloading: boolean;
  onDownload: () => void;
  className?: string;
}) {
  return (
    <Button
      type="button"
      onClick={onDownload}
      disabled={isDownloading || isPending || !resume}
      aria-label="Download PDF"
      className={className}
    >
      {isDownloading ? (
        <Spinner data-icon="inline-start" aria-hidden />
      ) : (
        <Download aria-hidden data-icon="inline-start" />
      )}
      <span className="hidden sm:inline">Download PDF</span>
    </Button>
  );
}

export function DownloadErrorAlert({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="border-b p-3">
      <Alert variant="destructive">
        <AlertCircle aria-hidden />
        <AlertTitle>{message}</AlertTitle>
      </Alert>
    </div>
  );
}

export function ResumeStudioHeader({
  jobDescription,
  headingRef,
}: {
  jobDescription: string;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Link
          href="/"
          aria-label="Opti home"
          className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-primary focus-visible:ring-offset-2"
        >
          <BrandMark />
        </Link>
        <Separator orientation="vertical" className="h-4 shrink-0" />
        <StudioHeading
          label={studioRoleLabel(jobDescription)}
          headingRef={headingRef}
          className="font-medium text-slate-700"
        />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link href="/login" />}
          className="mr-1 hidden text-xs sm:inline-flex"
        >
          Sign in
        </Button>
      </div>
    </header>
  );
}
