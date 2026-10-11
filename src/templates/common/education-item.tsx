type EducationItemProps = {
  title: string;
  meta?: string;
  dates?: string;
};

export function EducationItem({ title, meta, dates }: EducationItemProps) {
  const dateLabel = dates?.trim();
  return (
    <article className="mb-[var(--resume-entry)]">
      <div className="flex items-baseline justify-between gap-3">
        <h4 className="text-sm font-semibold">{title}</h4>
        {dateLabel ? <span className="shrink-0 text-xs text-[var(--resume-muted)]">{dateLabel}</span> : null}
      </div>
      {meta ? <p className="text-sm text-[var(--resume-muted)]">{meta}</p> : null}
    </article>
  );
}
