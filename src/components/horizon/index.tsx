import { forwardRef } from "react";
import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonTone = "primary" | "secondary" | "quiet" | "danger";

export const HorizonButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { tone?: ButtonTone }>(function HorizonButton({ className, tone = "primary", ...props }, ref) {
  const tones: Record<ButtonTone, string> = {
    primary: "bg-horizon-primary text-white hover:bg-horizon-primary/90",
    secondary: "border border-horizon-outline/20 bg-white text-horizon-ink hover:bg-horizon-canvas",
    quiet: "text-horizon-muted hover:bg-horizon-primary/8 hover:text-horizon-ink",
    danger: "bg-red-700 text-white hover:bg-red-800",
  };
  return <button ref={ref} className={cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--horizon-radius-control)] px-4 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", tones[tone], className)} {...props} />;
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
