import { cn } from "@/lib/utils";

type SectionBadgeProps = {
  label: string;
  className?: string;
};

export function SectionBadge({ label, className }: SectionBadgeProps) {
  return (
    <span
      className={cn(
        "inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent-foreground",
        className,
      )}
    >
      {label}
    </span>
  );
}
