"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, Menu, PenLine, ShieldCheck, UserRound, X } from "lucide-react";
import { useState } from "react";

import { BrandMark } from "@/components/landing/brand-mark";
import { authClient } from "@/server/auth/client";

const links = [
  { href: "/dashboard", label: "Master résumé", icon: FileText },
  { href: "/dashboard/generator", label: "Tailor a résumé", icon: PenLine },
];

export function AuthenticatedSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const signOut = async () => { await authClient.signOut(); router.push("/"); router.refresh(); };
  const nav = <nav aria-label="Workspace navigation" className="grid gap-1">{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${pathname === href ? "bg-horizon-primary/10 text-horizon-primary" : "text-horizon-muted hover:bg-white/60 hover:text-horizon-ink"}`}><Icon aria-hidden className="size-4" />{label}</Link>)}</nav>;
  return <>
    <button type="button" aria-label="Open workspace navigation" onClick={() => setOpen(true)} className="fixed left-4 top-20 z-30 flex size-10 items-center justify-center rounded-full bg-white/80 text-horizon-ink shadow-sm backdrop-blur lg:hidden"><Menu aria-hidden className="size-4" /></button>
    {open ? <button aria-label="Close workspace navigation" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-horizon-ink/20 lg:hidden" /> : null}
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/60 bg-white/75 px-5 pb-6 pt-6 shadow-xl backdrop-blur-xl transition-transform lg:translate-x-0 lg:shadow-none ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex items-center justify-between"><Link href="/dashboard" aria-label="Opti dashboard" onClick={() => setOpen(false)}><BrandMark /></Link><button type="button" aria-label="Close workspace navigation" onClick={() => setOpen(false)} className="rounded-full p-2 text-horizon-muted lg:hidden"><X aria-hidden className="size-4" /></button></div>
      <p className="mt-10 px-3 text-[10px] font-bold uppercase tracking-[0.17em] text-horizon-muted">Workspace</p>
      <div className="mt-3">{nav}</div>
      <div className="mt-auto grid gap-1 border-t border-horizon-outline/15 pt-4"><Link href="/dashboard#privacy" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-horizon-muted hover:bg-white/60 hover:text-horizon-ink"><ShieldCheck aria-hidden className="size-4" />Privacy boundary</Link><Link href="/dashboard#account" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-horizon-muted hover:bg-white/60 hover:text-horizon-ink"><UserRound aria-hidden className="size-4" />Account</Link><button type="button" onClick={signOut} className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-horizon-muted hover:bg-white/60 hover:text-horizon-ink">Sign out</button></div>
    </aside>
  </>;
}
