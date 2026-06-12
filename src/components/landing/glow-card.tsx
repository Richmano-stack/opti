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
        "surface-glass rounded-2xl p-6 transition-all duration-300",
        "hover:-translate-y-1 hover:border-primary/30 hover:bg-card/50 hover:shadow-[0_8px_32px_rgba(59,130,246,0.12)]",
        highlighted &&
          "border-primary/40 shadow-[0_0_40px_rgba(59,130,246,0.15)] ring-1 ring-primary/20",
        className,
      )}
    >
      {children}
    </div>
  );
}
