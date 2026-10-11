import { useId, type ReactNode } from "react";

export function ResumeSection({ title, children, divided }: { title: string; children: ReactNode; divided?: boolean }) {
  const id = useId();
  return (
    <section className="mb-[var(--resume-section)]" aria-labelledby={id}>
      <h3
        id={id}
        className={
          divided
            ? "mb-2 border-b border-[var(--resume-rule)] pb-1 text-[11px] font-semibold uppercase tracking-[0.14em]"
            : "mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--resume-accent)]"
        }
      >
        {title}
      </h3>
      {children}
    </section>
  );
}
