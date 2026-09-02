import Link from "next/link";
import type { ReactNode, RefObject } from "react";
import { CheckCircle2, FileText, LoaderCircle, Shield, Sparkles } from "lucide-react";

import type { GuestGenerationState } from "@/app/actions/generate-resume";
import { TailoredResumeResult } from "@/components/pdf";

export function GuestWorkspaceHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            aria-label="Opti home"
            className="rounded-md text-xl font-bold tracking-tight text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink focus-visible:ring-offset-4"
          >
            Opti
          </Link>
          <span aria-hidden className="h-6 w-px bg-slate-200" />
          <span className="text-sm font-medium text-slate-600">Guest workspace</span>
        </div>
        <Link
          href="/login"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink focus-visible:ring-offset-2"
        >
          Log in
        </Link>
      </nav>
    </header>
  );
}

export function GuestTextAreaField({
  id,
  name,
  value,
  onChange,
  label,
  placeholder,
  maxChars,
  disabled,
}: {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  maxChars: number;
  disabled: boolean;
}) {
  const descriptionId = `${id}-description`;

  return (
    <div>
      <label htmlFor={id} className="text-sm font-bold text-slate-900">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={maxChars}
        required
        disabled={disabled}
        placeholder={placeholder}
        aria-describedby={descriptionId}
        className="mt-2 min-h-44 w-full resize-y rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-sky-300 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
      />
      <div
        id={descriptionId}
        className="mt-1.5 flex items-center justify-between text-xs text-slate-400"
      >
        <span>Plain text only</span>
        <span>{value.length.toLocaleString()} / {maxChars.toLocaleString()}</span>
      </div>
    </div>
  );
}

export function GuestResultPanel({
  state,
  isPending,
  headingRef,
}: {
  state: GuestGenerationState;
  isPending: boolean;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  let content: ReactNode;

  if (isPending) {
    content = (
      <div role="status" className="flex flex-1 flex-col justify-center px-4 sm:px-10">
        <div className="mx-auto w-full max-w-md" aria-label="Generating tailored résumé">
          <LoaderCircle aria-hidden className="mx-auto size-7 animate-spin text-brand-ink motion-reduce:animate-none" />
          <p className="mt-4 text-center text-sm font-semibold text-slate-800">Tailoring your résumé...</p>
          <p className="mt-1 text-center text-xs text-slate-500">This can take a moment.</p>
          <div aria-hidden className="mt-8 space-y-3 motion-safe:animate-pulse">
            <div className="h-3 w-2/5 rounded bg-sky-100" />
            <div className="h-2.5 w-full rounded bg-slate-100" />
            <div className="h-2.5 w-11/12 rounded bg-slate-100" />
            <div className="h-2.5 w-4/5 rounded bg-slate-100" />
          </div>
        </div>
      </div>
    );
  } else if (state.status === "success") {
    content = (
      <div className="flex-1 overflow-auto">
        <TailoredResumeResult resume={state.data} />
      </div>
    );
  } else {
    content = (
      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-10 text-center">
        <span className="flex size-14 items-center justify-center rounded-xl bg-sky-50 text-brand-ink">
          <FileText aria-hidden className="size-7 stroke-[1.5]" />
        </span>
        <h3 className="mt-5 text-base font-bold text-slate-900">Your tailored résumé will appear here</h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
          Your result will be editable before download.
        </p>
      </div>
    );
  }

  return (
    <section
      aria-labelledby="guest-result-heading"
      aria-live="polite"
      aria-busy={isPending}
      className="flex min-h-[580px] flex-col rounded-xl border border-sky-100 bg-white/95 p-5 shadow-xs sm:p-6 lg:sticky lg:top-24"
    >
      <div className="border-b border-slate-100 pb-4">
        <h2 id="guest-result-heading" ref={headingRef} tabIndex={-1} className="text-base font-bold text-slate-900 outline-none">
          Your tailored résumé
        </h2>
      </div>
      {content}
    </section>
  );
}

const trustItems = [
  { icon: Shield, text: "Processed only to generate this result" },
  { icon: CheckCircle2, text: "Designed for ATS readability" },
  { icon: Sparkles, text: "You review before download" },
];

export function GuestTrustRow() {
  return (
    <aside aria-label="Guest workspace information" className="mt-5 border-t border-sky-100 py-4">
      <div className="grid gap-3 text-xs font-medium text-slate-600 sm:grid-cols-3">
        {trustItems.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2 sm:justify-center">
            <Icon aria-hidden className="size-4 shrink-0 text-brand-ink" />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
