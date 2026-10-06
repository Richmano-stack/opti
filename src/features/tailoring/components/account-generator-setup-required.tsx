import Link from "next/link";
import { ArrowRight, FileText, LockKeyhole } from "lucide-react";

import { AccountBar } from "@/components/horizon/account-bar";
import type { AuthUser } from "@/server/auth/types";

export function AccountGeneratorSetupRequired({ user }: { user: AuthUser }) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-white text-horizon-ink">
      <AccountBar user={user} title="Tailor a résumé" />
      <div className="flex min-h-0 flex-1 items-center justify-center bg-slate-100/70 p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-horizon-primary/10 text-horizon-primary">
            <FileText aria-hidden className="size-6" />
          </span>
          <h2 className="mt-4 text-lg font-bold tracking-tight text-slate-900">Your source comes first</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Add your master résumé once. Opti will use only that source to focus your real experience for every application.
          </p>
          <Link href="/dashboard" className="horizon-button-primary mt-6 h-11 px-6 text-sm">
            Go to master résumé <ArrowRight aria-hidden className="size-4" />
          </Link>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
            <LockKeyhole aria-hidden className="size-3.5 text-horizon-secondary" />
            Only your master résumé is saved.
          </p>
        </div>
      </div>
    </div>
  );
}
