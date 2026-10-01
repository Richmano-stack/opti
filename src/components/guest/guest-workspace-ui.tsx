import Link from "next/link";
import type { ReactNode, RefObject } from "react";
import { CheckCircle2, Eye, FileText, LoaderCircle, LockKeyhole, Shield } from "lucide-react";

import type { GuestGenerationState } from "@/app/actions/generate-resume";
import { TailoredResumeResult } from "@/components/pdf";

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
      <label htmlFor={id} className="text-sm font-semibold text-horizon-ink">
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
        className="mt-1.5 min-h-36 w-full resize-y rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-3 text-sm leading-6 text-horizon-ink outline-none transition-colors placeholder:text-neutral-500 hover:border-neutral-300 focus:border-horizon-secondary focus:bg-white focus:ring-2 focus:ring-horizon-secondary/20 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500"
      />
      <div
        id={descriptionId}
        className="mt-1.5 flex items-center justify-between px-0.5 text-[11px] font-medium text-neutral-600"
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
        <span className="flex size-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-700">
          <FileText aria-hidden className="size-5 stroke-[1.75]" />
        </span>
        <h3 className="mt-4 text-base font-semibold text-horizon-ink">Your tailored résumé will appear here</h3>
        <p className="mt-1 max-w-xs text-sm leading-6 text-neutral-700">
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
      className="flex min-h-[32rem] flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-20"
    >
      <div className="border-b border-neutral-200 pb-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-horizon-tertiary">Review &amp; download</p>
        <h2 id="guest-result-heading" ref={headingRef} tabIndex={-1} className="mt-1.5 text-xl font-semibold tracking-[-0.02em] text-horizon-ink outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary">
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
    <aside aria-label="Guest workspace information" className="mt-4 rounded-xl border border-neutral-200 bg-white px-4 py-3">
      <div className="grid gap-2 text-xs font-medium text-neutral-700 sm:grid-cols-3">
        {trustItems.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2 sm:justify-center">
            <Icon aria-hidden className="size-3.5 shrink-0 text-horizon-secondary" />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}


export function GuestWorkspaceFooter() {
  return (
    <footer className="mt-8 border-t border-neutral-800 bg-horizon-ink px-4 py-6 text-white sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-horizon-inverse-primary">Guest mode</p>
          <p className="mt-1 text-sm font-semibold">Try the flow. Keep your privacy.</p>
          <p className="mt-1 text-xs text-white/60">Guest inputs and generated results are not saved.</p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <Link href="/signup" className="horizon-button-primary h-10 px-4 text-xs">
            Create your workspace <span aria-hidden>→</span>
          </Link>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-4 text-xs font-semibold text-white/70">
            <Link href="/" className="hover:text-white">Opti home</Link>
            <Link href="/login" className="hover:text-white">Log in</Link>
            <Link href="/signup" className="hover:text-white">Create account</Link>
          </nav>
          <p className="text-[11px] text-white/45">© {new Date().getFullYear()} Opti. Built for focused applications.</p>
        </div>
      </div>
    </footer>
  );
}

