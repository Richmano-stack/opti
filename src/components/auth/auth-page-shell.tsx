import { Check, FileText, Sparkles } from "lucide-react";
import Link from "next/link";

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
    <main className="relative z-10 mx-auto grid w-full max-w-[112rem] flex-1 items-center gap-6 px-6 pb-8 pt-28 sm:px-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(25rem,0.92fr)] lg:gap-8 lg:px-16 lg:py-32">
      <section
        aria-labelledby="auth-context-title"
        className="horizon-glass relative overflow-hidden rounded-[2rem] px-6 py-8 sm:px-10 sm:py-10 lg:min-h-[37rem] lg:px-14 lg:py-14"
      >
        <div aria-hidden="true" className="absolute -right-20 -top-24 size-72 rounded-full bg-horizon-secondary/12 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between gap-10">
          <div className="max-w-2xl">
            <span className="horizon-eyebrow">{page.eyebrow}</span>
            <h1 id="auth-context-title" className="mt-5 max-w-xl text-3xl font-extrabold leading-[1.12] tracking-[-0.035em] text-horizon-ink sm:text-4xl lg:text-5xl">
              {page.title}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-horizon-muted sm:text-base">{page.description}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:max-w-2xl">
            <ContextStep icon={<FileText />} label="Keep" text="one master resume" />
            <ContextStep icon={<Sparkles />} label="Tailor" text="for the role ahead" />
            <ContextStep icon={<Check />} label="Review" text="before you use it" />
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/70 pt-6 text-sm">
            <Link href="/try" className="font-semibold text-horizon-ink underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary">
              Continue as guest
            </Link>
            <span className="text-xs text-horizon-muted">Guest work isn’t saved.</span>
          </div>
        </div>
      </section>

      <section aria-label={variant === "login" ? "Sign in" : "Create an account"} className="mx-auto w-full max-w-[31rem]">
        {children}
      </section>
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
