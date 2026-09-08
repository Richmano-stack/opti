"use client";

import type { ReactNode } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, LogOut, Menu, PenLine, UserRound, X } from "lucide-react";
import { useState } from "react";

import { BrandMark } from "@/components/landing/brand-mark";
import { cn } from "@/lib/utils";
import { authClient } from "@/server/auth/client";
import type { AuthUser } from "@/server/auth/types";

const navigation = [
  { href: "/dashboard", label: "Résumé", icon: FileText },
  { href: "/dashboard/generator", label: "Tailor", icon: PenLine },
];

export function AuthenticatedAppShell({ children, user, title }: { children: ReactNode; user: AuthUser; title: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const signOut = async () => { await authClient.signOut(); router.push("/"); router.refresh(); };
  const links = (mobile = false) => navigation.map(({ href, label, icon: Icon }) => {
    const active = pathname === href;
    return <Link key={href} href={href} onClick={() => setMenuOpen(false)} className={cn("flex items-center gap-3 rounded-[var(--horizon-radius-control)] font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary", mobile ? "flex-1 flex-col justify-center gap-1 py-2 text-[10px]" : "px-3 py-2.5 text-sm", active ? "bg-horizon-primary/10 text-horizon-primary" : "text-horizon-muted hover:bg-horizon-primary/5 hover:text-horizon-ink")}><Icon aria-hidden className="size-4" />{label}</Link>;
  });

  return <div className="min-h-dvh bg-horizon-canvas text-horizon-ink lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
    <aside className="hidden border-r border-horizon-outline/15 bg-white/75 p-5 lg:flex lg:flex-col">
      <Link href="/dashboard" aria-label="Opti dashboard"><BrandMark /></Link>
      <p className="mt-10 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-horizon-muted">Workspace</p>
      <nav aria-label="Workspace navigation" className="mt-3 grid gap-1">{links()}</nav>
      <button type="button" onClick={signOut} className="mt-auto flex items-center gap-3 rounded-[var(--horizon-radius-control)] px-3 py-2.5 text-left text-sm font-bold text-horizon-muted hover:bg-horizon-primary/5 hover:text-horizon-ink"><LogOut aria-hidden className="size-4" />Sign out</button>
    </aside>

    <div className="flex min-h-dvh min-w-0 flex-col pb-16 lg:pb-0">
      <header className="flex min-h-16 items-center justify-between border-b border-horizon-outline/10 bg-white/70 px-4 backdrop-blur sm:px-6">
        <div className="flex items-center gap-3"><button type="button" aria-label="Open navigation" onClick={() => setMenuOpen(true)} className="rounded-[var(--horizon-radius-control)] p-2 text-horizon-muted lg:hidden"><Menu aria-hidden className="size-5" /></button><p className="text-sm font-bold lg:text-base">{title}</p></div>
        <span className="inline-flex size-9 items-center justify-center rounded-full bg-horizon-secondary/10 text-xs font-bold text-horizon-secondary" aria-label={user.name ?? user.email}>{(user.name ?? user.email).slice(0, 2).toUpperCase()}</span>
      </header>
      <main className="min-w-0 flex-1">{children}</main>
    </div>

    {menuOpen ? <div className="fixed inset-0 z-50 lg:hidden"><button type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)} className="absolute inset-0 bg-horizon-ink/30" /><aside className="relative flex h-full w-72 flex-col bg-white p-5 shadow-xl"><div className="flex items-center justify-between"><BrandMark /><button type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)} className="rounded-[var(--horizon-radius-control)] p-2 text-horizon-muted"><X aria-hidden className="size-5" /></button></div><nav aria-label="Workspace navigation" className="mt-8 grid gap-1">{links()}</nav><button type="button" onClick={signOut} className="mt-auto flex items-center gap-3 rounded-[var(--horizon-radius-control)] px-3 py-2.5 text-left text-sm font-bold text-horizon-muted"><LogOut aria-hidden className="size-4" />Sign out</button></aside></div> : null}

    <nav aria-label="Mobile workspace navigation" className="fixed inset-x-0 bottom-0 z-30 flex border-t border-horizon-outline/15 bg-white/95 px-2 backdrop-blur lg:hidden">{links(true)}<Link href="/dashboard#account" className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[10px] font-bold text-horizon-muted"><UserRound aria-hidden className="size-4" />Account</Link></nav>
  </div>;
}
