import Link from "next/link";

function OptiLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-6 text-brand-ink" aria-hidden="true">
        <path d="M12 2C12.5 7.5 16.5 11.5 22 12C16.5 12.5 12.5 16.5 12 22C11.5 16.5 7.5 12.5 2 12C7.5 11.5 11.5 7.5 12 2Z" />
      </svg>
      <span className="text-xl font-bold tracking-tight text-slate-900">Opti</span>
    </div>
  );
}

const navLinkClass =
  "rounded-sm text-xs font-medium text-slate-600 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink focus-visible:ring-offset-4";

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
      <nav aria-label="Primary navigation" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Opti home" className="rounded-md transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink focus-visible:ring-offset-4">
          <OptiLogo />
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          <a href="#benefits" className={navLinkClass}>Why Opti</a>
          <a href="#how-it-works" className={navLinkClass}>How it works</a>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/login" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink focus-visible:ring-offset-2 sm:px-3.5">Log in</Link>
          <Link href="/try" className="flex h-9 items-center justify-center rounded-lg bg-brand-action px-3 text-xs font-semibold text-slate-900 shadow-sm shadow-sky-200/20 transition-colors hover:bg-brand-action-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink focus-visible:ring-offset-2 sm:px-4">
            <span className="sm:hidden">Try free</span><span className="hidden sm:inline">Try it free</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
