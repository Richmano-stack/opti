import Link from "next/link";
import { ChevronDown } from "lucide-react";

function OptiLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-6 text-brand-ink"
        aria-hidden="true"
      >
        <path d="M12 2C12.5 7.5 16.5 11.5 22 12C16.5 12.5 12.5 16.5 12 22C11.5 16.5 7.5 12.5 2 12C7.5 11.5 11.5 7.5 12 2Z" />
      </svg>
      <span className="text-xl font-bold tracking-tight text-slate-900">Opti</span>
    </div>
  );
}

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="transition-opacity hover:opacity-90">
          <OptiLogo />
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <a
            href="#benefits"
            className="text-xs font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            Why Opti
          </a>
          <a
            href="#how-it-works"
            className="text-xs font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            How it works
          </a>
          <a
            href="#pricing"
            className="text-xs font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            Pricing
          </a>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 transition-colors hover:text-slate-900 cursor-pointer"
          >
            <span>Resources</span>
            <ChevronDown className="size-3 text-slate-400" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/try"
            className="h-8 rounded-lg bg-brand-action hover:bg-brand-action-hover text-slate-900 font-semibold text-xs px-4 shadow-sm shadow-sky-200/20 transition-all flex items-center justify-center"
          >
            Try it free
          </Link>
        </div>
      </nav>
    </header>
  );
}
