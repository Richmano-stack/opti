import Link from "next/link";
import { CheckCircle2, FileText } from "lucide-react";

import { AccountHeader } from "@/components/account/account-header";
import { Button } from "@/components/ui/button";
import type { AuthUser } from "@/server/auth/types";

export function AccountGeneratorSetupRequired({ user }: { user: AuthUser }) {
  return (
    <div className="page-sky-gradient min-h-screen text-slate-900">
      <AccountHeader user={user} />
      <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-soft text-brand-ink">
          <FileText aria-hidden className="size-7" />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold tracking-tight">
          Save your master résumé first
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Your master résumé is the source Opti uses to tailor every application. Add it once,
          then return here with any job description.
        </p>
        <Link href="/dashboard" className="mt-6">
          <Button className="h-10 rounded-xl px-5 font-semibold">
            <CheckCircle2 aria-hidden className="size-4" /> Go to master résumé
          </Button>
        </Link>
      </main>
    </div>
  );
}