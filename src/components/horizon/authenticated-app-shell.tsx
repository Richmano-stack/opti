"use client";

import type { ReactNode } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, LogOut, Menu, PenLine, UserRound, X } from "lucide-react";
import { useEffect, useId, useState } from "react";

import { BrandMark } from "@/components/landing/brand-mark";
import { cn } from "@/lib/utils";
import { authClient } from "@/server/auth/client";
import type { AuthUser } from "@/server/auth/types";

const navigation = [
  { href: "/dashboard", label: "Résumé", icon: FileText },
  { href: "/dashboard/generator", label: "Tailor", icon: PenLine },
];

interface AuthenticatedAppShellProps {
  children: ReactNode;
  user: AuthUser;
  title: string;
  sidebarUtility?: ReactNode;
}

export function AuthenticatedAppShell({ children, user, title, sidebarUtility }: AuthenticatedAppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const drawerId = useId();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const signOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  const links = (mobile = false) => navigation.map(({ href, label, icon: Icon }) => {
    const active = pathname === href;
    return (
      <Link
        key={href}
        href={href}
        onClick={() => setMenuOpen(false)}
        className={cn(
          "flex min-h-11 items-center gap-3 rounded-[var(--horizon-radius-control)] font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary",
          mobile ? "flex-1 flex-col justify-center gap-1 px-2 py-1 text-[10px]" : "px-3 py-2.5 text-sm",
          active ? "bg-horizon-primary/10 text-horizon-primary" : "text-horizon-muted hover:bg-horizon-primary/5 hover:text-horizon-ink",
        )}
      >
        <Icon aria-hidden className="size-4" />
        {label}
      </Link>
    );
  });

  return (
    <div className="min-h-dvh min-w-0 overflow-x-clip bg-horizon-canvas text-horizon-ink lg:grid lg:h-dvh lg:grid-cols-[15rem_minmax(0,1fr)] lg:overflow-hidden">
      <aside aria-label="Desktop workspace sidebar" className="hidden min-h-0 border-r border-horizon-outline/15 bg-white/75 p-5 lg:flex lg:flex-col">
        <Link href="/dashboard" aria-label="Opti dashboard"><BrandMark /></Link>
        <p className="mt-10 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-horizon-muted">Workspace</p>
        <nav aria-label="Workspace navigation" className="mt-3 grid gap-1">{links()}</nav>
        {sidebarUtility ? <div className="mt-auto">{sidebarUtility}</div> : null}
        <button type="button" onClick={signOut} className={`${sidebarUtility ? "mt-4" : "mt-auto"} flex min-h-11 items-center gap-3 rounded-[var(--horizon-radius-control)] px-3 py-2.5 text-left text-sm font-bold text-horizon-muted hover:bg-horizon-primary/5 hover:text-horizon-ink`}>
          <LogOut aria-hidden className="size-4" />Sign out
        </button>
      </aside>

      <div className="flex min-h-dvh min-w-0 flex-col pb-16 lg:h-dvh lg:min-h-0 lg:pb-0">
        <header className="flex min-h-16 shrink-0 items-center justify-between gap-3 border-b border-horizon-outline/10 bg-white/70 px-4 backdrop-blur sm:px-6">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button type="button" aria-controls={drawerId} aria-expanded={menuOpen} aria-label="Open navigation" onClick={() => setMenuOpen(true)} className="inline-flex size-11 shrink-0 items-center justify-center rounded-[var(--horizon-radius-control)] text-horizon-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary lg:hidden">
              <Menu aria-hidden className="size-5" />
            </button>
            <p className="truncate text-sm font-bold lg:text-base">{title}</p>
          </div>
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-horizon-secondary/10 text-xs font-bold text-horizon-secondary" aria-label={user.name ?? user.email}>
            {(user.name ?? user.email).slice(0, 2).toUpperCase()}
          </span>
        </header>
        <main className="min-w-0 flex-1 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain">{children}</main>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)} className="absolute inset-0 bg-horizon-ink/30" />
          <aside id={drawerId} role="dialog" aria-modal="true" aria-label="Workspace navigation" className="relative flex h-dvh w-full max-w-xs flex-col bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between gap-4">
              <BrandMark />
              <button type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)} className="inline-flex size-11 shrink-0 items-center justify-center rounded-[var(--horizon-radius-control)] text-horizon-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary">
                <X aria-hidden className="size-5" />
              </button>
            </div>
            <nav aria-label="Drawer workspace navigation" className="mt-8 grid gap-1">{links()}</nav>
            <button type="button" onClick={signOut} className="mt-auto flex min-h-11 items-center gap-3 rounded-[var(--horizon-radius-control)] px-3 py-2.5 text-left text-sm font-bold text-horizon-muted">
              <LogOut aria-hidden className="size-4" />Sign out
            </button>
          </aside>
        </div>
      ) : null}

      <nav aria-label="Mobile workspace navigation" className="fixed inset-x-0 bottom-0 z-30 flex min-h-16 border-t border-horizon-outline/15 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        {links(true)}
        <Link href="/dashboard#account" className="flex min-h-11 flex-1 flex-col items-center justify-center gap-1 px-2 py-1 text-[10px] font-bold text-horizon-muted">
          <UserRound aria-hidden className="size-4" />Account
        </Link>
      </nav>
    </div>
  );
}
