import Link from "next/link";

import { BrandMark } from "@/components/landing/brand-mark";
import type { AuthUser } from "@/server/auth/types";

export function AccountGeneratorHeader({ user }: { user: AuthUser }) {
  return (
    <header className="px-4 pt-4 sm:px-6 sm:pt-6">
      <div className="horizon-glass mx-auto flex h-16 max-w-[1120px] items-center justify-between rounded-full px-4 sm:px-6">
        <Link href="/dashboard" aria-label="Opti dashboard" className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-primary focus-visible:ring-offset-2">
          <BrandMark />
        </Link>
        <div className="flex items-center gap-3 text-right">
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-horizon-ink">{user.name || user.email}</p>
            <p className="text-[10px] text-horizon-muted">Account workspace</p>
          </div>
          <Link href="/dashboard" className="horizon-button-ghost h-10 px-4 text-xs">Master résumé</Link>
        </div>
      </div>
    </header>
  );
}
