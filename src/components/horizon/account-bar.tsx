"use client";

import type { ReactNode, RefObject } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { authClient } from "@/server/auth/client";
import type { AuthUser } from "@/server/auth/types";

export function accountInitials(user: AuthUser): string {
  const source = user.name?.trim() || user.email;
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export function AccountBar({
  user,
  title,
  homeHref = "/dashboard",
  headingId,
  headingRef,
  actions,
}: {
  user: AuthUser;
  title: ReactNode;
  homeHref?: string;
  headingId?: string;
  headingRef?: RefObject<HTMLHeadingElement | null>;
  actions?: ReactNode;
}) {
  const router = useRouter();
  const initials = accountInitials(user);
  const identity = user.name ?? user.email;

  const signOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Link
          href={homeHref}
          aria-label="Opti home"
          className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-primary focus-visible:ring-offset-2"
        >
          <BrandMark />
        </Link>
        <span aria-hidden className="h-4 w-px shrink-0 bg-slate-200" />
        <h1
          id={headingId}
          ref={headingRef}
          tabIndex={headingRef ? -1 : undefined}
          className="truncate text-sm font-medium text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary"
        >
          {title}
        </h1>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {actions}
        <span
          aria-label={identity}
          className="inline-flex size-8 items-center justify-center rounded-full bg-horizon-secondary/10 text-[11px] font-bold text-horizon-secondary"
        >
          {initials}
        </span>
        <button
          type="button"
          onClick={signOut}
          aria-label="Sign out"
          className="inline-flex size-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary"
        >
          <LogOut aria-hidden className="size-4" />
        </button>
      </div>
    </header>
  );
}
