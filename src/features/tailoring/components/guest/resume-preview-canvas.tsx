"use client";

import { useState } from "react";
import { Check, Copy, LoaderCircle, Minus, Plus, Sparkles } from "lucide-react";

import { GuestResumePreview } from "@/features/tailoring/components/guest/guest-resume-preview";
import type { OptimizedResume } from "@/features/tailoring/lib/types";

const zoomSteps = [80, 90, 100, 110, 120] as const;

export function resumeToPlainText(resume: OptimizedResume): string {
  const lines: string[] = [resume.contact.name];
  const headline = resume.headline ?? resume.experience[0]?.title;
  if (headline) lines.push(headline);
  const contact = [
    resume.contact.email,
    resume.contact.phone,
    resume.contact.location,
    resume.contact.linkedin,
    resume.contact.portfolio,
  ].filter(Boolean);
  if (contact.length > 0) lines.push(contact.join(" · "));

  lines.push("", "Professional summary", resume.summary, "", "Experience");
  for (const entry of resume.experience) {
    lines.push(entry.title, [entry.company, entry.dates].filter(Boolean).join(" · "));
    for (const bullet of entry.bullets) lines.push(`• ${bullet}`);
    lines.push("");
  }
  if (resume.skills.length > 0) lines.push("Skills", resume.skills.join(" · "), "");
  if (resume.education.length > 0) {
    lines.push("Education");
    for (const entry of resume.education) {
      lines.push([entry.degree, entry.institution, entry.dates].filter(Boolean).join(" · "));
    }
    lines.push("");
  }
  if (resume.certifications && resume.certifications.length > 0) {
    lines.push("Certifications");
    for (const entry of resume.certifications) {
      lines.push([entry.name, entry.issuer, entry.dates].filter(Boolean).join(" · "));
    }
    lines.push("");
  }
  if (resume.projects && resume.projects.length > 0) {
    lines.push("Projects");
    for (const entry of resume.projects) {
      lines.push([entry.name, entry.dates].filter(Boolean).join(" · "));
      for (const bullet of entry.bullets) lines.push(`• ${bullet}`);
      lines.push("");
    }
  }
  return lines.join("\n").trim();
}

export function ResumePreviewCanvas({
  resume,
  isPending,
  isReady,
}: {
  resume: OptimizedResume;
  isPending: boolean;
  isReady: boolean;
}) {
  const [zoom, setZoom] = useState<(typeof zoomSteps)[number]>(100);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const zoomIndex = zoomSteps.indexOf(zoom);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resumeToPlainText(resume));
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  };

  return (
    <section aria-label="Résumé preview" className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-slate-100/70 md:col-span-8 lg:col-span-8 xl:col-span-8">
      <div className="flex min-h-0 flex-1 items-start justify-center overflow-y-auto p-8">
        <div className="flex w-full max-w-[816px] flex-col items-center">
          <div className="sticky top-0 z-10 mb-4 inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-white px-1.5 py-1 shadow-sm">
            <div className="inline-flex items-center" role="group" aria-label="Zoom">
              <button
                type="button"
                aria-label="Zoom out"
                disabled={zoomIndex <= 0}
                onClick={() => setZoom(zoomSteps[zoomIndex - 1] ?? zoom)}
                className="inline-flex size-8 items-center justify-center rounded-full text-slate-700 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary"
              >
                <Minus aria-hidden className="size-3.5" />
              </button>
              <span className="min-w-10 text-center text-xs font-medium text-slate-700">{zoom}%</span>
              <button
                type="button"
                aria-label="Zoom in"
                disabled={zoomIndex >= zoomSteps.length - 1}
                onClick={() => setZoom(zoomSteps[zoomIndex + 1] ?? zoom)}
                className="inline-flex size-8 items-center justify-center rounded-full text-slate-700 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary"
              >
                <Plus aria-hidden className="size-3.5" />
              </button>
            </div>
            <span aria-hidden className="h-4 w-px bg-slate-200" />
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary"
            >
              {copyState === "copied" ? <Check aria-hidden className="size-3.5" /> : <Copy aria-hidden className="size-3.5" />}
              {copyState === "copied" ? "Copied" : "Copy text"}
            </button>
            <button
              type="submit"
              disabled={isPending || !isReady}
              className="inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary disabled:pointer-events-none disabled:opacity-45"
            >
              {isPending ? <LoaderCircle aria-hidden className="size-3.5 animate-spin motion-reduce:animate-none" /> : <Sparkles aria-hidden className="size-3.5" />}
              Refine with AI
            </button>
          </div>
          {copyState === "failed" ? (
            <p role="alert" className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-800">
              The résumé text could not be copied. Please try again.
            </p>
          ) : null}
          <div className="w-full" style={{ zoom: zoom / 100 }}>
            <GuestResumePreview resume={resume} className="rounded-sm border border-slate-200/60 shadow-md shadow-slate-300/50" />
          </div>
        </div>
      </div>
    </section>
  );
}
