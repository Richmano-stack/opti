type HeaderLink = {
  label: string;
  href: string;
};

type HeaderSectionProps = {
  name: string;
  headline?: string;
  email?: string;
  phone?: string;
  location?: string;
  links?: HeaderLink[];
  tone?: "paper" | "accent";
};

function contactParts(props: HeaderSectionProps): string[] {
  return [props.email, props.phone, props.location].filter((value): value is string => Boolean(value));
}

export function HeaderSection(props: HeaderSectionProps) {
  const contact = contactParts(props);
  const links = props.links?.filter((link) => link.href.trim().length > 0) ?? [];
  const onAccent = props.tone === "accent";
  const muted = onAccent ? "text-white/80" : "text-[var(--resume-muted)]";

  return (
    <header className={onAccent ? "text-center text-[var(--resume-accent-ink)]" : "text-center"}>
      <h2 className="font-[family-name:var(--resume-display)] text-[2rem] leading-tight font-semibold tracking-[-0.03em]">
        {props.name}
      </h2>
      {props.headline ? <p className={`mt-1 text-sm ${onAccent ? "text-white/90" : "text-[var(--resume-ink)]"}`}>{props.headline}</p> : null}
      {contact.length > 0 ? <p className={`mt-2 text-xs leading-5 ${muted}`}>{contact.join(" · ")}</p> : null}
      {links.length > 0 ? (
        <ul className={`mt-1 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs ${onAccent ? "text-white" : "text-[var(--resume-accent)]"}`}>
          {links.map((link) => (
            <li key={`${link.label}-${link.href}`}>
              {link.href.startsWith("http") ? (
                <a href={link.href} className="underline-offset-2 hover:underline">
                  {link.label}
                </a>
              ) : (
                <span>{link.href}</span>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </header>
  );
}
