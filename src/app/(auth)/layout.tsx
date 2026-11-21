import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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

      <header className="relative z-20 px-6 pt-6 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[112rem] items-center justify-between">
          <Link
            href="/"
            aria-label="Opti home"
            className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary"
          >
            <BrandMark className="scale-90 sm:scale-100" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-horizon-muted transition-colors hover:text-horizon-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary"
          >
            <ArrowLeft aria-hidden className="size-3.5" />
            Back to home
          </Link>
        </div>
      </header>

      {children}

      <footer className="relative z-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-6 pb-6 text-center text-[11px] text-horizon-muted">
        <Link href="/" className="hover:text-horizon-ink underline-offset-4 hover:underline">
          Opti home
        </Link>
        <span aria-hidden="true" className="text-horizon-muted/40">·</span>
        <span>Your master resume is saved to your account. Guest sessions are temporary.</span>
      </footer>

      <Toaster richColors closeButton position="top-center" />
    </div>
  );
}