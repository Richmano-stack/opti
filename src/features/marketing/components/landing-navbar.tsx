import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { buttonVariants } from "@/components/ui/button";
import { getServerSession } from "@/server/auth/session";

export type LandingNavbarProps = {
  guest?: boolean;
  floating?: boolean;
};

export async function LandingNavbar({
  guest = false,
  floating = true,
}: LandingNavbarProps = {}) {
  const session = await getServerSession();
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
          {session?.user ? (
            <Link href="/dashboard" className={buttonVariants({ size: "lg" })}>
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className={buttonVariants({ variant: "outline", size: "sm", className: "h-8 px-2 text-[10px] sm:h-10 sm:px-4 sm:text-xs" })}>
                Log in
              </Link>
              <Link href={guest ? "/signup?intent=save_draft" : "/signup"} className={buttonVariants({ variant: "outline", size: "sm", className: "h-8 px-2 text-[10px] sm:h-10 sm:px-4 sm:text-xs" })}>
                Sign up
              </Link>
              {guest ? (
                <Link href="/signup?intent=save_draft" className={buttonVariants({ size: "lg" })}>
                  Create account
                </Link>
              ) : (
                <Link href="/try" className={buttonVariants({ size: "lg" })}>
                  Try it free
                </Link>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
