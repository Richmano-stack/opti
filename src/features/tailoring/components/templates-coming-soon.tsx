import Link from "next/link";
import { ArrowRight, LayoutTemplate } from "lucide-react";

import { AuthenticatedAppShell } from "@/components/horizon/authenticated-app-shell";
import { buttonVariants } from "@/components/ui/button";
import type { AuthUser } from "@/server/auth/types";

export function TemplatesComingSoon({ user }: { user: AuthUser }) {
  return (
    <AuthenticatedAppShell user={user} title="Templates" fill>
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="flex max-w-sm flex-col items-center text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LayoutTemplate aria-hidden className="size-6" />
          </span>
          <h1 className="mt-4 text-xl font-semibold tracking-tight text-foreground">Templates are coming soon</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            We&apos;re designing more résumé layouts. Until then, every tailored résumé uses our clean,
            ATS-friendly layout.
          </p>
          <Link href="/dashboard/generator" className={buttonVariants({ className: "mt-6" })}>
            Tailor a résumé <ArrowRight aria-hidden data-icon="inline-end" />
          </Link>
        </div>
      </div>
    </AuthenticatedAppShell>
  );
}
