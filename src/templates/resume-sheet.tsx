"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

const sheetStyle = `
[data-resume-page] {
  width: 8.5in;
  height: auto;
  overflow: visible;
  background: #ffffff;
}
[data-resume-page]:not([data-resume-fitted]) {
  visibility: hidden;
}
[data-resume-print] {
  width: 8.5in;
}
[data-resume-print] > article {
  box-sizing: border-box !important;
  box-shadow: none;
  border: none;
  width: 8.5in !important;
  max-width: 8.5in !important;
  height: auto !important;
  overflow: visible !important;
}
[data-resume-print] .flex {
  min-width: 0;
}
[data-resume-print] .flex > :first-child {
  min-width: 0;
}
[data-resume-print] article article,
[data-resume-print] li {
  break-inside: avoid;
}
[data-resume-print] h3,
[data-resume-print] h4 {
  break-after: avoid;
}
`;

export type Typeface = "sans" | "serif";

const typefaceClass: Record<Typeface, string> = {
  sans: "font-sans",
  serif: "font-serif",
};

export function ResumeSheet({
  children,
  fitKey,
  typeface,
}: {
  children: ReactNode;
  fitKey: string;
  typeface: Typeface;
}) {
  const pageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    let cancelled = false;
    const markReady = () => {
      if (!cancelled) page.dataset.resumeFitted = "true";
    };
    markReady();
    void document.fonts.ready.then(markReady);
    return () => {
      cancelled = true;
    };
  }, [fitKey]);

  return (
    <div
      ref={pageRef}
      data-resume-page=""
      data-typeface={typeface}
      className={`@container/resume ${typefaceClass[typeface]}`}
    >
      <style>{sheetStyle}</style>
      <div data-resume-print="">{children}</div>
    </div>
  );
}
