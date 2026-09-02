import Link from "next/link";
import type { ReactNode, RefObject } from "react";
import { CheckCircle2, Eye, FileText, LoaderCircle, LockKeyhole, Shield } from "lucide-react";

import type { GuestGenerationState } from "@/app/actions/generate-resume";
import { BrandMark } from "@/components/landing/brand-mark";
import { TailoredResumeResult } from "@/components/pdf";

export function GuestWorkspaceHeader() {
  return (
    <header className="sticky top-0 z-20 px-4 pt-4 sm:px-6 sm:pt-6">
      <nav
        aria-label="Primary navigation"
        className="horizon-glass mx-auto flex h-16 max-w-[1120px] items-center justify-between rounded-full px-4 sm:px-6"
      >
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <Link
            href="/"
            aria-label="Opti home"
            className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary focus-visible:ring-offset-4"
          >
            <BrandMark className="scale-90 sm:scale-100" />
          </Link>
          <span aria-hidden className="h-5 w-px bg-horizon-outline/30" />
          <span className="truncate text-xs font-bold uppercase tracking-[0.12em] text-horizon-muted sm:text-sm">Guest workspace</span>
        </div>
        <Link
          href="/login"
          className="horizon-button-ghost px-5 py-2.5 text-sm"
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
    <div className="group">
      <label htmlFor={id} className="text-sm font-bold text-horizon-ink">
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
        className="mt-2 min-h-48 w-full resize-y rounded-3xl border border-white/80 bg-white/55 p-5 text-sm leading-6 text-horizon-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.8)] outline-none backdrop-blur-sm transition-[border-color,background-color,box-shadow] placeholder:text-horizon-muted/55 focus:border-horizon-secondary/45 focus:bg-white/75 focus:ring-4 focus:ring-horizon-secondary/10 disabled:cursor-not-allowed disabled:bg-white/30 disabled:text-horizon-muted sm:min-h-52"
      />
      <div
        id={descriptionId}
        className="mt-2 flex items-center justify-between px-1 text-[11px] font-medium text-horizon-muted/75"
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
      <div role="status" className="flex flex-1 flex-col justify-center px-4 py-16 sm:px-10">
        <div className="mx-auto w-full max-w-md" aria-label="Generating tailored résumé">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-horizon-primary/10 text-horizon-primary">
            <LoaderCircle aria-hidden className="size-6 animate-spin motion-reduce:animate-none" />
          </span>
          <p className="mt-5 text-center text-sm font-semibold text-horizon-ink">Tailoring your résumé...</p>
          <p className="mt-1 text-center text-xs text-horizon-muted">This can take a moment.</p>
          <div aria-hidden className="mt-8 space-y-3 motion-safe:animate-pulse">
            <div className="h-3 w-2/5 rounded-full bg-horizon-secondary/15" />
            <div className="h-2.5 w-full rounded-full bg-horizon-outline/10" />
            <div className="h-2.5 w-11/12 rounded-full bg-horizon-outline/10" />
            <div className="h-2.5 w-4/5 rounded-full bg-horizon-outline/10" />
          </div>
        </div>
      </div>
    );
  } else if (state.status === "success") {
    content = (
      <div className="flex-1 overflow-auto pt-5">
        <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-horizon-secondary">
          <CheckCircle2 aria-hidden className="size-4" />
          Ready to review
        </div>
        <TailoredResumeResult resume={state.data} />
      </div>
    );
  } else {
    content = (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <span className="flex size-16 items-center justify-center rounded-full border border-horizon-secondary/15 bg-horizon-secondary/8 text-horizon-secondary">
          <FileText aria-hidden className="size-7 stroke-[1.5]" />
        </span>
        <h3 className="mt-6 text-lg font-semibold text-horizon-ink">Your tailored résumé will appear here</h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-horizon-muted">
          Review it here before you download.
        </p>
      </div>
    );
  }

  return (
    <section
      aria-labelledby="guest-result-heading"
      aria-live="polite"
      aria-busy={isPending}
      className="horizon-glass flex min-h-[36rem] flex-col rounded-3xl p-5 sm:p-8 lg:p-10 xl:sticky xl:top-28"
    >
      <div className="border-b border-horizon-outline/15 pb-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-horizon-tertiary">Review &amp; download</p>
        <h2 id="guest-result-heading" ref={headingRef} tabIndex={-1} className="mt-2 text-2xl font-semibold tracking-[-0.01em] text-horizon-ink outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary">
          Your tailored résumé
        </h2>
        {state.status === "success" ? <p className="mt-2 text-sm text-horizon-muted">Review every detail before downloading your PDF.</p> : null}
      </div>
      {content}
    </section>
  );
}

const trustItems = [
  { icon: Shield, text: "Processed only to generate this result" },
  { icon: LockKeyhole, text: "Private by design" },
  { icon: Eye, text: "You review before download" },
];

export function GuestTrustRow() {
  return (
    <aside aria-label="Guest workspace information" className="mt-6 rounded-3xl border border-white/60 bg-white/25 px-5 py-4 backdrop-blur-md sm:px-8">
      <div className="grid gap-3 text-xs font-medium text-horizon-muted sm:grid-cols-3">
        {trustItems.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2 sm:justify-center">
            <Icon aria-hidden className="size-4 shrink-0 text-horizon-secondary" />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

