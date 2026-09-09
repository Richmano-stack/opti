import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SkeletonBlock({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} aria-hidden="true" className={cn("animate-pulse rounded-[var(--horizon-radius-control)] bg-horizon-outline/12 motion-reduce:animate-none", className)} />;
}

export function LoadingState({ label = "Loading", children, className, ...props }: HTMLAttributes<HTMLDivElement> & { label?: string; children?: ReactNode }) {
  return (
    <div {...props} aria-busy="true" aria-live="polite" className={cn("w-full space-y-4", className)} role="status">
      <span className="sr-only">{label}</span>
      {children ?? (
        <>
          <SkeletonBlock className="h-6 w-2/5" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-4/5" />
        </>
      )}
    </div>
  );
}
