import Link from "next/link";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

import { BrandMark } from "@/components/landing/brand-mark";
import { getServerSession } from "@/server/auth/session";

export default async function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="horizon-page relative flex min-h-svh flex-col overflow-hidden text-horizon-ink">
      <div aria-hidden="true" className="horizon-aurora">
        <div className="horizon-orb horizon-orb-primary" />
        <div className="horizon-orb horizon-orb-secondary" />
        <div className="horizon-orb horizon-orb-tertiary" />
      </div>

      <header className="fixed inset-x-0 top-0 z-20 px-4 pt-4 sm:px-6 sm:pt-6">
        <nav className="horizon-glass mx-auto flex max-w-[1120px] items-center justify-between rounded-full px-4 py-2.5 sm:px-6" aria-label="Authentication navigation">
          <Link href="/" aria-label="Opti home" className="rounded-full transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-primary focus-visible:ring-offset-2">
            <BrandMark className="scale-90 sm:scale-100" />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/" className="hidden px-3 py-2 text-xs font-bold text-horizon-muted underline-offset-4 hover:text-horizon-ink hover:underline sm:inline-flex">
              How it works
            </Link>
            <Link href="/try" className="horizon-button-ghost px-4 py-2 text-xs sm:px-5">
              Guest mode
            </Link>
          </div>
        </nav>
      </header>

      {children}

      <footer className="relative z-10 px-6 pb-6 text-center text-[11px] text-horizon-muted">
        Your master resume is saved to your account. Guest sessions are temporary.
      </footer>

      <Toaster richColors closeButton position="top-center" />
    </div>
  );
}

