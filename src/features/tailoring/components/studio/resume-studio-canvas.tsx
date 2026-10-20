"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { FileText, LoaderCircle, Minus, MoveHorizontal, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  resolveScale,
  zoomInFrom,
  zoomOutFrom,
  zoomPercent,
  type ZoomMode,
} from "@/features/tailoring/lib/canvas-zoom";
import type { OptimizedResume } from "@/features/tailoring/lib/types";
import { LETTER_HEIGHT_PX, LETTER_WIDTH_PX } from "@/templates/letter-page";
import { getTemplate, type TemplateId } from "@/templates/registry";
import { ResumeSheet } from "@/templates/resume-sheet";

const placeholderSheetStyle = { width: LETTER_WIDTH_PX, minHeight: LETTER_HEIGHT_PX, padding: 48 } as const;

function useAvailableWidth() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [availableWidth, setAvailableWidth] = useState(0);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const measure = () => {
      const style = getComputedStyle(viewport);
      const width =
        viewport.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      if (width > 0) setAvailableWidth(width);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  return { viewportRef, availableWidth };
}

function useSheetHeight() {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [sheetHeight, setSheetHeight] = useState(LETTER_HEIGHT_PX);

  useLayoutEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    const measure = () => setSheetHeight(sheet.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(sheet);
    return () => observer.disconnect();
  }, []);

  return { sheetRef, sheetHeight };
}

function PendingSheet() {
  return (
    <div
      role="status"
      aria-busy="true"
      style={placeholderSheetStyle}
      className="flex flex-col justify-between rounded-sm bg-white text-slate-900 shadow-2xl"
    >
      <div>
        <div className="flex flex-col items-center border-b border-slate-100 pb-8 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-horizon-primary/10 text-horizon-primary">
            <LoaderCircle aria-hidden className="size-6 animate-spin motion-reduce:animate-none" />
          </span>
          <p className="mt-4 text-base font-semibold text-horizon-ink">Tailoring your résumé...</p>
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
        ATS-friendly Letter layout
      </div>
    </div>
  );
}

function EmptySheet() {
  return (
    <div
      aria-label="Résumé paper sheet"
      style={placeholderSheetStyle}
      className="relative flex flex-col justify-between rounded-sm bg-white text-slate-900 shadow-2xl"
    >
      <div aria-hidden className="space-y-8 opacity-40">
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

      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur-sm">
          <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-horizon-primary/10 text-horizon-primary">
            <FileText aria-hidden className="size-6" />
          </span>
          <h2 className="mt-4 text-lg font-bold tracking-tight text-slate-900">
            Your tailored résumé will appear here
          </h2>
          <p className="mt-2 text-xs leading-5 text-slate-600">
            Paste the job description on the left and tailor your résumé to see the Letter pages that download.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4 text-center text-xs text-slate-400">
        ATS-friendly Letter layout
      </div>
    </div>
  );
}

export function ResumeStudioCanvas({
  resume,
  isPending,
  templateId,
  actions,
}: {
  resume?: OptimizedResume;
  isPending: boolean;
  templateId: TemplateId;
  actions?: ReactNode;
}) {
  const [zoomMode, setZoomMode] = useState<ZoomMode>("fit");
  const { viewportRef, availableWidth } = useAvailableWidth();
  const { sheetRef, sheetHeight } = useSheetHeight();
  const SelectedTemplate = getTemplate(templateId).Component;

  const scale = resolveScale(zoomMode, availableWidth, LETTER_WIDTH_PX);
  const nextZoomIn = zoomInFrom(scale);
  const nextZoomOut = zoomOutFrom(scale);

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col p-2">
      <section
        aria-label="Résumé canvas"
        className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="pointer-events-none absolute top-2 right-5 z-10 flex items-center gap-2">
          <div
            role="group"
            aria-label="Zoom"
            className="pointer-events-auto inline-flex items-center gap-0.5 rounded-full border border-slate-200/80 bg-white px-1.5 py-1 shadow-sm"
          >
            <Button
              type="button"
              size="sm"
              variant={zoomMode === "fit" ? "secondary" : "ghost"}
              aria-pressed={zoomMode === "fit"}
              onClick={() => setZoomMode("fit")}
              className="h-8 rounded-full px-2.5 text-xs"
            >
              <MoveHorizontal aria-hidden className="size-3.5" />
              Fit width
            </Button>
            <Button
              type="button"
              size="sm"
              variant={zoomMode === 100 ? "secondary" : "ghost"}
              aria-pressed={zoomMode === 100}
              onClick={() => setZoomMode(100)}
              className="h-8 rounded-full px-2.5 text-xs"
            >
              100%
            </Button>

            <Separator orientation="vertical" className="mx-0.5 h-4" />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Zoom out"
              disabled={nextZoomOut === null}
              onClick={() => {
                if (nextZoomOut !== null) setZoomMode(nextZoomOut);
              }}
              className="size-8 rounded-full"
            >
              <Minus aria-hidden className="size-3.5" />
            </Button>
            <span aria-live="polite" className="min-w-10 text-center text-xs font-medium tabular-nums text-slate-700">
              {zoomPercent(scale)}%
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Zoom in"
              disabled={nextZoomIn === null}
              onClick={() => {
                if (nextZoomIn !== null) setZoomMode(nextZoomIn);
              }}
              className="size-8 rounded-full"
            >
              <Plus aria-hidden className="size-3.5" />
            </Button>
          </div>
          {actions ? <div className="pointer-events-auto">{actions}</div> : null}
        </div>

        <div
          ref={viewportRef}
          className="flex min-h-0 flex-1 items-start justify-center-safe overflow-auto scroll-smooth px-4 pt-14 pb-8 [scrollbar-gutter:stable] sm:px-8"
        >
          <div
            className="shrink-0"
            style={
              zoomMode === "fit" && availableWidth === 0
                ? { width: "100%", height: LETTER_HEIGHT_PX, overflow: "hidden", visibility: "hidden" }
                : { width: LETTER_WIDTH_PX * scale, height: sheetHeight * scale }
            }
          >
            <div
              ref={sheetRef}
              id="resume-document-canvas"
              style={{ width: LETTER_WIDTH_PX, transform: `scale(${scale})`, transformOrigin: "top left" }}
            >
              {resume ? (
                <div className="shadow-2xl">
                  <ResumeSheet fitKey={`${templateId}:${JSON.stringify(resume)}`}>
                    <SelectedTemplate resume={resume} />
                  </ResumeSheet>
                </div>
              ) : isPending ? (
                <PendingSheet />
              ) : (
                <EmptySheet />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
