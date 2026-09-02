import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  compact?: boolean;
};

export function BrandMark({ className, compact = false }: BrandMarkProps) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <svg viewBox="0 0 120 120" className="size-9 shrink-0" aria-hidden="true">
        <circle cx="60" cy="60" r="45" fill="#B42907" />
        <circle cx="60" cy="60" r="25" fill="#F9F9F9" />
        <path d="M78 19 42 101" stroke="#F9F9F9" strokeWidth="11" />
        <path d="m78 19-9 20" stroke="#00668A" strokeWidth="11" strokeLinecap="round" />
      </svg>
      {!compact ? (
        <span className="-ml-0.5 text-[1.7rem] font-extrabold leading-none tracking-[-0.08em] text-horizon-ink">
          pti
        </span>
      ) : null}
    </span>
  );
}
