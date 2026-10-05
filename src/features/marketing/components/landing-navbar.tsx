import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";

export function LandingNavbar({
  guest = false,
  floating = true,
}: {
  guest?: boolean;
  floating?: boolean;
}) {
  return (
    <header className={floating ? "fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-6" : "shrink-0 px-4 pt-4 sm:px-6 sm:pt-6"}>
      <nav
        aria-label="Primary navigation"
        className="horizon-glass mx-auto flex h-16 max-w-[1120px] items-center justify-between rounded-full px-4 sm:px-6"
      >
        <Link
          href="/"
          aria-label="Opti home"
          className="rounded-full transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-primary focus-visible:ring-offset-2"
        >
          <BrandMark />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <Link href="/#benefits" className="horizon-nav-link">Why Opti</Link>
          <Link href="/#how-it-works" className="horizon-nav-link">How it works</Link>
          <Link href="/#privacy" className="horizon-nav-link">Privacy</Link>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/login" className="horizon-button-ghost hidden h-10 px-5 text-xs sm:inline-flex">
            Log in
          </Link>
          {guest ? (
            <Link href="/signup" className="horizon-button-primary h-10 px-5 text-xs">
              Create account
            </Link>
          ) : (
            <Link href="/try" className="horizon-button-primary h-10 px-5 text-xs">
              Try it free
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
