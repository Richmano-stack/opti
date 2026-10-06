import { ArrowLeft, Check, FileText, Sparkles } from "lucide-react";
import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";

type AuthPageVariant = "login" | "signup" | "recover";

type AuthPageShellProps = {
  children: React.ReactNode;
  variant: AuthPageVariant;
};

const content = {
  login: {
    eyebrow: "Welcome back",
    title: "Your master resume, ready when you are.",
    description:
      "Sign in to return to the resume you keep in Opti, then tailor from a source you trust.",
    mobileTitle: "Sign in to Opti",
    panelLabel: "Sign in",
  },
  signup: {
    eyebrow: "A better starting point",
    title: "Save one master resume.",
    description:
      "Keep your experience in one dependable place. Return to it whenever you’re ready to tailor again—without rebuilding your story from scratch.",
    mobileTitle: "Create your Opti account",
    panelLabel: "Create an account",
  },
  recover: {
    eyebrow: "Account access",
    title: "The link in your email is the way in.",
    description:
      "Verification and password reset both arrive as a link. Open it on this device to finish.",
    mobileTitle: "Recover your Opti account",
    panelLabel: "Recover account",
  },
} as const;

export function AuthPageShell({ children, variant }: AuthPageShellProps) {
  const page = content[variant];

  return (
    <main className="relative z-10 mx-auto flex w-full max-w-[112rem] flex-1 flex-col gap-5 px-4 pb-6 pt-4 sm:px-8 sm:pt-6 lg:px-16 lg:py-8">
      <nav
        aria-label="Authentication navigation"
        className="flex h-12 shrink-0 items-center justify-between gap-3"
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
            className="inline-flex h-10 items-center justify-center rounded-full px-3 text-xs font-bold text-horizon-ink hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary lg:hidden"
          >
            Continue as guest
          </Link>
          <Link
            href="/"
            className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-bold text-horizon-ink hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Home</span>
          </Link>
        </div>
      </nav>

      <div className="grid content-start gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(25rem,0.92fr)] lg:items-stretch lg:gap-8">
        <h1 className="sr-only lg:hidden">{page.mobileTitle}</h1>

        <section
          aria-labelledby="auth-context-title"
          className="horizon-glass relative hidden h-full overflow-hidden rounded-[2rem] px-8 py-8 sm:px-10 sm:py-10 lg:block lg:px-12 lg:py-10"
        >
        <div aria-hidden="true" className="absolute -right-20 -top-24 size-72 rounded-full bg-horizon-secondary/12 blur-3xl" />
        <div className="relative flex h-full flex-col justify-center gap-8">
          <div className="max-w-2xl">
            <span className="horizon-eyebrow">{page.eyebrow}</span>
            <h1 id="auth-context-title" className="mt-4 max-w-xl text-3xl font-extrabold leading-[1.12] tracking-[-0.035em] text-horizon-ink sm:text-4xl lg:text-[2.75rem]">
              {page.title}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-horizon-muted sm:text-base sm:leading-7">{page.description}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:max-w-2xl">
            <ContextStep icon={<FileText />} label="Keep" text="one master resume" />
            <ContextStep icon={<Sparkles />} label="Tailor" text="for the role ahead" />
            <ContextStep icon={<Check />} label="Review" text="before you use it" />
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/70 pt-5 text-sm">
            <Link href="/try" className="font-semibold text-horizon-ink underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary">
              Continue as guest
            </Link>
            <span className="text-xs text-horizon-muted">Guest work isn’t saved.</span>
          </div>
        </div>
      </section>

      <section aria-label={page.panelLabel} className="mx-auto flex h-full w-full max-w-[31rem] flex-col">
        {children}
      </section>
      </div>
    </main>
  );
}

function ContextStep({ icon, label, text }: { icon: React.ReactNode; label: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/35 p-4 backdrop-blur-xl">
      <div className="flex items-center gap-2 text-horizon-secondary">
        <span className="grid size-8 place-items-center rounded-full bg-white/70 [&>svg]:size-4" aria-hidden="true">{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-[0.15em]">{label}</span>
      </div>
      <p className="mt-3 text-xs font-semibold text-horizon-ink">{text}</p>
    </div>
  );
}
