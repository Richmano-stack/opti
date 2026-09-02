import Link from "next/link";

import { BrandMark } from "./brand-mark";

const navLinkClass =
  "rounded-full px-3 py-2 text-xs font-semibold text-horizon-muted transition-colors hover:text-horizon-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-primary focus-visible:ring-offset-2";

export function LandingNavbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-6">
      <nav
        aria-label="Primary navigation"
        className="horizon-glass mx-auto flex h-16 max-w-[1120px] items-center justify-between rounded-full px-4 sm:px-6"
      >
        <Link
          href="/"
          aria-label="Opti home"
          className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-primary focus-visible:ring-offset-2"
        >
          <BrandMark />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <a href="#benefits" className={navLinkClass}>Why Opti</a>
          <a href="#how-it-works" className={navLinkClass}>How it works</a>
          <a href="#privacy" className={navLinkClass}>Privacy</a>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/login" className="horizon-button-ghost hidden h-10 px-5 text-xs sm:inline-flex">
            Log in
          </Link>
          <Link href="/try" className="horizon-button-primary h-10 px-5 text-xs">
            Try it free
          </Link>
        </div>
      </nav>
    </header>
  );
}
