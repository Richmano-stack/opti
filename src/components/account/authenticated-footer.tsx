import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandMark } from "@/components/landing/brand-mark";

export function AuthenticatedFooter() {
  return (
    <footer className="mt-16 bg-horizon-ink px-6 pb-8 pt-12 text-white sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 border-b border-white/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-horizon-inverse-primary">Keep moving with clarity</p>
            <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] sm:text-3xl">One truthful source. Sharper applications.</h2>
          </div>
          <Link href="/dashboard/generator" className="horizon-button-primary h-11 shrink-0 bg-white px-5 text-xs !text-horizon-ink hover:bg-horizon-inverse-primary">Tailor for a role <ArrowRight aria-hidden="true" className="size-3.5" /></Link>
        </div>
        <div className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div><BrandMark /><p className="mt-3 text-xs text-white/50">A calm workspace for focused applications.</p></div>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-white/65"><Link href="/dashboard" className="hover:text-white">Master resume</Link><Link href="/dashboard/generator" className="hover:text-white">Generator</Link><Link href="/" className="hover:text-white">Opti home</Link></nav>
        </div>
        <div className="border-t border-white/15 pt-5 text-xs text-white/40">© {new Date().getFullYear()} Opti. Built for focused applications.</div>
      </div>
    </footer>
  );
}
