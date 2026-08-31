import Link from "next/link";
import { Sparkles } from "lucide-react";

import type { AuthUser } from "@/server/auth/types";

export function AccountHeader({ user }: { user: AuthUser }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2.5 font-bold text-slate-900">
          <Sparkles aria-hidden className="size-5 text-brand-ink" />
          <span className="text-xl tracking-tight">Opti</span>
        </Link>
        <div className="text-right text-xs">
          <p className="font-semibold text-slate-800">{user.name || user.email}</p>
          <Link href="/dashboard" className="text-slate-500 hover:text-brand-ink">
            Master résumé
          </Link>
        </div>
      </div>
    </header>
  );
}