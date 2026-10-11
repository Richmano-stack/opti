type SkillGroup = {
  label: string;
  skills: string[];
};

type SkillsSectionProps = {
  skills?: string[];
  groups?: SkillGroup[];
  variant?: "pills" | "inline";
};

function filled(skills: string[] | undefined): string[] {
  return skills?.map((skill) => skill.trim()).filter((skill) => skill.length > 0) ?? [];
}

export function SkillsSection({ skills, groups, variant = "pills" }: SkillsSectionProps) {
  const grouped = groups
    ?.map((group) => ({ label: group.label, skills: filled(group.skills) }))
    .filter((group) => group.skills.length > 0);
  const flat = filled(skills);

  if (grouped && grouped.length > 0) {
    return (
      <div className="space-y-[var(--resume-entry)]">
        {grouped.map((group) => (
          <p key={group.label} className="text-sm leading-6">
            <span className="font-semibold">{group.label}: </span>
            {group.skills.join(", ")}
          </p>
        ))}
      </div>
    );
  }

  if (flat.length === 0) return null;

  if (variant === "inline") {
    return <p className="text-sm leading-6">{flat.join(", ")}</p>;
  }

  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Skills">
      {flat.map((skill) => (
        <li key={skill} className="rounded-full border border-[var(--resume-rule)] px-2.5 py-1 text-xs">
          {skill}
        </li>
      ))}
    </ul>
  );
}
