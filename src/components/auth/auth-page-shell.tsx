import { ArrowLeft, Check, FileText, Sparkles } from "lucide-react";
import Link from "next/link";

import { BrandMark } from "@/components/landing/brand-mark";

type AuthPageShellProps = {
  children: React.ReactNode;
  variant: "login" | "signup";
};

const content = {
  login: {
    eyebrow: "Welcome back",
    title: "Your master resume, ready when you are.",
    description:
      "Sign in to return to the resume you keep in Opti, then tailor from a source you trust.",
  },
  signup: {
    eyebrow: "A better starting point",
    title: "Save one master resume.",
    description:
      "Keep your experience in one dependable place. Return to it whenever you’re ready to tailor again—without rebuilding your story from scratch.",
  },
} as const;

export function AuthPageShell({ children, variant }: AuthPageShellProps) {
  const page = content[variant];

  return (
    <main className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-[112rem] flex-1 flex-col gap-3 overflow-hidden px-4 py-3 sm:gap-4 sm:px-8 sm:py-4 lg:px-12 lg:py-5">
      <nav
        aria-label="Authentication navigation"
        className="flex h-11 shrink-0 items-center justify-between gap-3"
      >
        <Link
          href="/"
          aria-label="Opti home"
          className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary focus-visible:ring-offset-2"
        >
          <BrandMark className="scale-90 origin-left" />
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/try"
            className="inline-flex h-10 items-center justify-center rounded-full border border-neutral-200 bg-white px-3.5 text-xs font-bold text-neutral-950 shadow-sm hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary lg:hidden"
          >
            Continue as guest
          </Link>
          <Link
            href="/"
            className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-bold text-neutral-900 hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Home</span>
          </Link>
        </div>
      </nav>

      <div className="grid min-h-0 flex-1 gap-4 overflow-hidden lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)] lg:items-stretch lg:gap-6">
        <h1 className="sr-only lg:hidden">
          {variant === "login" ? "Sign in to Opti" : "Create your Opti account"}
        </h1>

        <section
          aria-labelledby="auth-context-title"
          className="horizon-glass relative hidden min-h-0 overflow-hidden rounded-[1.75rem] px-8 py-8 lg:flex lg:flex-col lg:px-10 lg:py-9"
        >
          <div aria-hidden="true" className="absolute -right-20 -top-24 size-64 rounded-full bg-horizon-secondary/12 blur-3xl" />
          <div className="relative flex h-full min-h-0 flex-col justify-between gap-6">
            <div className="max-w-2xl">
              <span className="horizon-eyebrow">{page.eyebrow}</span>
              <h1
                id="auth-context-title"
                className="mt-4 max-w-xl text-3xl font-extrabold leading-[1.08] tracking-[-0.04em] text-horizon-ink xl:text-4xl"
              >
                {page.title}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-800">{page.description}</p>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-3">
              <ContextStep icon={<FileText />} label="Keep" text="one master resume" />
              <ContextStep icon={<Sparkles />} label="Tailor" text="for the role ahead" />
              <ContextStep icon={<Check />} label="Review" text="before you use it" />
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-white/70 pt-4">
              <Link
                href="/try"
                className="inline-flex h-10 items-center justify-center rounded-full border border-neutral-200 bg-white px-4 text-sm font-bold text-neutral-950 shadow-sm hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary"
              >
                Continue as guest
              </Link>
              <p className="text-sm leading-5 text-neutral-800">Guest work isn’t saved.</p>
            </div>
          </div>
        </section>

        <section
          aria-label={variant === "login" ? "Sign in" : "Create an account"}
          className="mx-auto flex h-full min-h-0 w-full max-w-[28rem] flex-col overflow-hidden"
        >
          {children}
        </section>
      </div>
    </main>
  );
}

function ContextStep({ icon, label, text }: { icon: React.ReactNode; label: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/35 p-3 backdrop-blur-xl">
      <div className="flex items-center gap-2 text-horizon-secondary">
        <span className="grid size-7 place-items-center rounded-full bg-white/70 [&>svg]:size-3.5" aria-hidden="true">
          {icon}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.15em]">{label}</span>
      </div>
      <p className="mt-2 text-xs font-semibold text-horizon-ink">{text}</p>
    </div>
  );
}
