import { cn } from "@/lib/utils";

type GlowCardProps = {
  children: React.ReactNode;
  className?: string;
  highlighted?: boolean;
};

export function GlowCard({
  children,
  className,
  highlighted = false,
}: GlowCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-brand-border hover:shadow-[0_8px_24px_rgba(125,180,210,0.06)]",
        highlighted && "border-brand-border ring-2 ring-brand-muted/20 shadow-[0_4px_20px_rgba(125,180,210,0.08)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
