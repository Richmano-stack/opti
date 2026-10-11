type ExperienceItemProps = {
  title: string;
  organization?: string;
  dates?: string;
  bullets?: string[];
};

function isCurrent(dates: string | undefined): boolean {
  return Boolean(dates && /present|current/i.test(dates));
}

export function ExperienceItem({ title, organization, dates, bullets }: ExperienceItemProps) {
  const visibleBullets = bullets?.map((bullet) => bullet.trim()).filter((bullet) => bullet.length > 0) ?? [];
  const dateLabel = dates?.trim();

  return (
    <article className="mb-[var(--resume-entry)]">
      <div className="flex items-baseline justify-between gap-3">
        <h4 className="text-sm font-semibold">{title}</h4>
        {dateLabel ? (
          <span
            className={
              isCurrent(dateLabel)
                ? "shrink-0 rounded-full bg-[var(--resume-accent)] px-2 py-0.5 text-[10px] font-semibold text-[var(--resume-accent-ink)]"
                : "shrink-0 text-xs text-[var(--resume-muted)]"
            }
          >
            {dateLabel}
          </span>
        ) : null}
      </div>
      {organization ? <p className="text-sm text-[var(--resume-muted)]">{organization}</p> : null}
      {visibleBullets.length > 0 ? (
        <ul className="mt-1.5 list-disc space-y-[var(--resume-bullet)] pl-4 text-sm leading-6">
          {visibleBullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
