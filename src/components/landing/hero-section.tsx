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
          Tailor your resume for{" "}
          <span className="text-brand-gradient">any job</span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Paste your resume and a target job description. Opti rewrites your
          experience to match the role and exports an ATS-friendly PDF.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link href="/signup" className="btn-brand h-12 min-w-[180px] px-8 text-sm">
            Get started
          </Link>
          <Link
            href="/login"
            className="btn-brand-outline h-12 min-w-[180px] px-8 text-sm"
          >
            Log in
          </Link>
        </div>
      </div>
    </section>
  );
}
