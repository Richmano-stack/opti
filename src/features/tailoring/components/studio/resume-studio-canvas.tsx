"use client";

import { useState } from "react";
import { Check, Copy, FileText, LoaderCircle, Minus, Plus, Sparkles } from "lucide-react";

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

export function ResumeStudioCanvas({
  resume,
  isPending,
  isReady,
}: {
  resume?: OptimizedResume;
  isPending: boolean;
  isReady: boolean;
}) {
  const [zoom, setZoom] = useState<(typeof zoomSteps)[number]>(100);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const zoomIndex = zoomSteps.indexOf(zoom);

  const handleCopy = async () => {
    if (!resume) return;
    try {
      await navigator.clipboard.writeText(resumeToPlainText(resume));
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  };

  return (
    <section
      aria-label="Résumé canvas"
      className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-slate-100/70"
    >
      <div className="flex min-h-0 flex-1 items-start justify-center overflow-y-auto p-4 sm:p-8">
        <div className="flex w-full max-w-[816px] flex-col items-center">
          {/* Floating Canvas Toolbar */}
          <div className="sticky top-0 z-10 mb-4 inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-white px-1.5 py-1 shadow-sm">
            <div className="inline-flex items-center" role="group" aria-label="Zoom">
              <button
                type="button"
                aria-label="Zoom out"
                disabled={zoomIndex <= 0}
                onClick={() => setZoom(zoomSteps[zoomIndex - 1] ?? zoom)}
                className="inline-flex size-8 items-center justify-center rounded-full text-slate-700 hover:bg-slate-50 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary"
              >
                <Minus aria-hidden className="size-3.5" />
              </button>
              <span className="min-w-10 text-center text-xs font-medium text-slate-700">{zoom}%</span>
              <button
                type="button"
                aria-label="Zoom in"
                disabled={zoomIndex >= zoomSteps.length - 1}
                onClick={() => setZoom(zoomSteps[zoomIndex + 1] ?? zoom)}
                className="inline-flex size-8 items-center justify-center rounded-full text-slate-700 hover:bg-slate-50 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary"
              >
                <Plus aria-hidden className="size-3.5" />
              </button>
            </div>

            <span aria-hidden className="h-4 w-px bg-slate-200" />

            <button
              type="button"
              onClick={handleCopy}
              disabled={!resume}
              className="inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary"
            >
              {copyState === "copied" ? (
                <Check aria-hidden className="size-3.5 text-emerald-600" />
              ) : (
                <Copy aria-hidden className="size-3.5" />
              )}
              {copyState === "copied" ? "Copied" : "Copy text"}
            </button>

            <button
              type="submit"
              disabled={isPending || !isReady}
              className="inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary disabled:pointer-events-none disabled:opacity-45"
            >
              {isPending ? (
                <LoaderCircle aria-hidden className="size-3.5 animate-spin motion-reduce:animate-none" />
              ) : (
                <Sparkles aria-hidden className="size-3.5" />
              )}
              {resume ? "Refine with AI" : "Tailor with AI"}
            </button>
          </div>

          {copyState === "failed" ? (
            <p
              role="alert"
              className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-800"
            >
              The résumé text could not be copied. Please try again.
            </p>
          ) : null}

          {/* Paper Sheet Stage (Strictly 1 Page ATS Layout) */}
          <div className="w-full transition-transform duration-150" style={{ zoom: zoom / 100 }}>
            {resume ? (
              <GuestResumePreview
                resume={resume}
                className="rounded-sm border border-slate-200/80 shadow-md shadow-slate-300/50"
              />
            ) : isPending ? (
              <div
                role="status"
                aria-busy="true"
                className="mx-auto flex min-h-[900px] w-full max-w-[816px] flex-col justify-between rounded-sm border border-slate-200/80 bg-white p-12 shadow-md shadow-slate-300/50"
              >
                <div>
                  <div className="flex flex-col items-center border-b border-slate-100 pb-8 text-center">
                    <span className="flex size-12 items-center justify-center rounded-full bg-horizon-primary/10 text-horizon-primary">
                      <LoaderCircle aria-hidden className="size-6 animate-spin motion-reduce:animate-none" />
                    </span>
                    <p className="mt-4 text-base font-semibold text-horizon-ink">
                      Tailoring your résumé...
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Aligning your real experience with the target job requirements.
                    </p>
                  </div>

                  <div aria-hidden className="mt-8 space-y-6 motion-safe:animate-pulse">
                    <div className="space-y-2">
                      <div className="h-3 w-1/4 rounded bg-slate-200" />
                      <div className="h-2.5 w-full rounded bg-slate-100" />
                      <div className="h-2.5 w-5/6 rounded bg-slate-100" />
                    </div>

                    <div className="space-y-2 pt-4">
                      <div className="h-3 w-1/5 rounded bg-slate-200" />
                      <div className="h-2.5 w-full rounded bg-slate-100" />
                      <div className="h-2.5 w-11/12 rounded bg-slate-100" />
                      <div className="h-2.5 w-4/5 rounded bg-slate-100" />
                    </div>

                    <div className="space-y-2 pt-4">
                      <div className="h-3 w-1/6 rounded bg-slate-200" />
                      <div className="flex gap-2">
                        <div className="h-6 w-20 rounded-md bg-slate-100" />
                        <div className="h-6 w-24 rounded-md bg-slate-100" />
                        <div className="h-6 w-16 rounded-md bg-slate-100" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
                  Strictly 1-page ATS formatted document
                </div>
              </div>
            ) : (
              <div
                aria-label="Résumé paper sheet"
                className="relative mx-auto flex min-h-[900px] w-full max-w-[816px] flex-col justify-between rounded-sm border border-slate-200/80 bg-white p-12 shadow-md shadow-slate-300/50"
              >
                {/* Paper sheet content outline (ATS paper look) */}
                <div className="space-y-8 opacity-40">
                  <div className="text-center">
                    <div className="mx-auto h-6 w-48 rounded bg-slate-300" />
                    <div className="mx-auto mt-2 h-3.5 w-36 rounded bg-slate-200" />
                    <div className="mx-auto mt-2 h-3 w-64 rounded bg-slate-100" />
                  </div>

                  <div className="space-y-2 border-t border-[#1c1c1c]/20 pt-4">
                    <div className="h-3 w-32 rounded bg-slate-300" />
                    <div className="h-2.5 w-full rounded bg-slate-100" />
                    <div className="h-2.5 w-11/12 rounded bg-slate-100" />
                  </div>

                  <div className="space-y-3 border-t border-[#1c1c1c]/20 pt-4">
                    <div className="h-3 w-28 rounded bg-slate-300" />
                    <div className="h-3 w-40 rounded bg-slate-200" />
                    <div className="h-2.5 w-full rounded bg-slate-100" />
                    <div className="h-2.5 w-4/5 rounded bg-slate-100" />
                  </div>

                  <div className="space-y-2 border-t border-[#1c1c1c]/20 pt-4">
                    <div className="h-3 w-20 rounded bg-slate-300" />
                    <div className="flex gap-2">
                      <div className="h-5 w-20 rounded bg-slate-100" />
                      <div className="h-5 w-24 rounded bg-slate-100" />
                      <div className="h-5 w-16 rounded bg-slate-100" />
                    </div>
                  </div>
                </div>

                {/* Welcoming invitation card over canvas center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="max-w-md rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur-sm">
                    <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-horizon-primary/10 text-horizon-primary">
                      <FileText aria-hidden className="size-6" />
                    </span>
                    <h2 className="mt-4 text-lg font-bold tracking-tight text-slate-900">
                      Your tailored résumé will appear here
                    </h2>
                    <p className="mt-2 text-xs leading-5 text-slate-600">
                      Paste the job description on the left and tailor your résumé to see your 1-page ATS-optimized document rendered right here.
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 text-center text-xs text-slate-400">
                  Strictly 1-page ATS formatted document
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
