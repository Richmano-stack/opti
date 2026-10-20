"use client";

import { useState, type RefObject } from "react";
import Link from "next/link";
import { Download, LoaderCircle, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  isReady,
  isDownloading,
  onDownload,
  form,
}: {
  resume?: OptimizedResume;
  isPending: boolean;
  isReady: boolean;
  isDownloading: boolean;
  onDownload: () => void;
  /** Id of the studio form, needed when the actions render outside it. */
  form?: string;
}) {
  return (
    <>
      <Badge variant="secondary" className="hidden sm:inline-flex">
        <span aria-hidden className="size-1.5 rounded-full bg-emerald-500" />
        {isPending ? "Tailoring" : resume ? "Draft Ready" : "Studio Ready"}
      </Badge>

      <Button
        type="submit"
        form={form}
        size="lg"
        variant="outline"
        disabled={isPending || !isReady}
        aria-label={resume ? "Refine with AI" : "Tailor my résumé"}
        className="rounded-full px-3 text-xs"
      >
        {isPending ? (
          <LoaderCircle aria-hidden className="size-3.5 animate-spin motion-reduce:animate-none" />
        ) : (
          <Sparkles aria-hidden className="size-3.5" />
        )}
        <span className="hidden sm:inline">{resume ? "Refine with AI" : "Tailor my résumé"}</span>
      </Button>

      <Button
        type="button"
        size="lg"
        onClick={onDownload}
        disabled={isDownloading || !resume}
        aria-label="Download PDF"
        className="rounded-full px-4 text-xs"
      >
        {isDownloading ? (
          <LoaderCircle aria-hidden className="size-3.5 animate-spin motion-reduce:animate-none" />
        ) : (
          <Download aria-hidden className="size-3.5" />
        )}
        <span className="hidden sm:inline">Download PDF</span>
      </Button>
    </>
  );
}

export function DownloadErrorAlert({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div role="alert" className="border-b border-red-200 bg-red-50 px-6 py-2 text-xs font-medium text-red-800">
      {message}
    </div>
  );
}

export function ResumeStudioHeader({
  resume,
  jobDescription,
  isPending,
  isReady,
  headingRef,
  templateId = "minimal",
}: {
  resume?: OptimizedResume;
  jobDescription: string;
  isPending: boolean;
  isReady: boolean;
  headingRef: RefObject<HTMLHeadingElement | null>;
  templateId?: TemplateId;
}) {
  const { isDownloading, downloadError, download } = useResumeDownload(resume, templateId);

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
          <StudioActions
            resume={resume}
            isPending={isPending}
            isReady={isReady}
            isDownloading={isDownloading}
            onDownload={download}
          />
        </div>
      </header>

      <DownloadErrorAlert message={downloadError} />
    </>
  );
}
