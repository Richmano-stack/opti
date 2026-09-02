import Link from "next/link";
import { ArrowRight, FileText, LockKeyhole } from "lucide-react";

import { AccountGeneratorHeader } from "@/components/account/account-generator-header";
import { AuthenticatedFooter } from "@/components/account/authenticated-footer";
import type { AuthUser } from "@/server/auth/types";

export function AccountGeneratorSetupRequired({ user }: { user: AuthUser }) {
  return (
    <div className="horizon-page min-h-screen text-horizon-ink">
      <AccountGeneratorHeader user={user} />
      <main className="mx-auto flex max-w-[760px] flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
        <span className="horizon-eyebrow">One step before tailoring</span>
        <div className="horizon-glass mt-8 w-full rounded-[2rem] p-8 sm:p-12">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-horizon-primary/10 text-horizon-primary">
          <FileText aria-hidden className="size-7" />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">Your source comes first</h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-horizon-muted sm:text-base">
          Add your master résumé once. Opti will use only that source to focus your real experience for every application.
        </p>
        <Link href="/dashboard" className="horizon-button-primary mt-8 h-12 px-7 text-sm">
          Go to master résumé <ArrowRight aria-hidden className="size-4" />
        </Link>
        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-horizon-muted"><LockKeyhole aria-hidden className="size-3.5 text-horizon-secondary" /> Only your master résumé is saved.</p>
        </div>
      </main>
      <AuthenticatedFooter />
    </div>
  );
}



