import { forwardRef } from "react";
import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonTone = "primary" | "secondary" | "quiet" | "danger";

const toneVariant = {
  primary: "default",
  secondary: "outline",
  quiet: "ghost",
  danger: "destructive",
} as const satisfies Record<ButtonTone, string>;

export const HorizonButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { tone?: ButtonTone }>(function HorizonButton({ tone = "primary", ...props }, ref) {
  return <Button ref={ref} variant={toneVariant[tone]} size="lg" {...props} />;
});

export function HorizonSurface({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-[var(--horizon-radius-card)] border border-white/70 bg-white/70 shadow-[var(--horizon-shadow-card)] backdrop-blur", className)} {...props} />;
}

export function HorizonInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("min-h-11 w-full rounded-[var(--horizon-radius-control)] border border-horizon-outline/25 bg-white px-3 text-sm text-horizon-ink outline-none placeholder:text-horizon-muted/65 focus:border-horizon-secondary focus:ring-2 focus:ring-horizon-secondary/20 disabled:cursor-not-allowed disabled:opacity-60", className)} {...props} />;
}

export function HorizonTextarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("min-h-32 w-full resize-y rounded-[var(--horizon-radius-control)] border border-horizon-outline/25 bg-white p-3 text-sm leading-6 text-horizon-ink outline-none placeholder:text-horizon-muted/65 focus:border-horizon-secondary focus:ring-2 focus:ring-horizon-secondary/20 disabled:cursor-not-allowed disabled:opacity-60", className)} {...props} />;
}

export function HorizonBadge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex items-center rounded-full bg-horizon-primary/8 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-horizon-primary", className)} {...props} />;
}

export function HorizonDivider({ className, ...props }: HTMLAttributes<HTMLHRElement>) {
  return <hr className={cn("border-0 border-t border-horizon-outline/15", className)} {...props} />;
}

export function HorizonAvatar({ name, className }: { name?: string | null; className?: string }) {
  const initials = (name ?? "Opti User").split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return <span aria-label={name ?? "User"} className={cn("inline-flex size-9 items-center justify-center rounded-full bg-horizon-secondary/10 text-xs font-bold text-horizon-secondary", className)}>{initials}</span>;
}
