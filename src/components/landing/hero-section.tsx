import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pb-28 lg:pt-36">
      <div aria-hidden className="ambient-glow">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute left-1/4 top-32 h-[400px] w-[500px] rounded-full bg-violet-600/15 blur-[100px]" />
      </div>

      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl">
          One resume. Tailored for{" "}
          <span className="text-brand-gradient">every application</span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Save your standard resume once. When you find a job, paste its
          description and get a focused, ready-to-review PDF without rebuilding
          your resume from scratch.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link href="/try" className="btn-brand h-12 min-w-[180px] px-8 text-sm">
            Try it free
          </Link>
          <Link href="/signup" className="btn-brand-outline h-12 min-w-[180px] px-8 text-sm">
            Save your résumé
          </Link>
        </div>
      </div>
    </section>
  );
}