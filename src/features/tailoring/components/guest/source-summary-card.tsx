import type { ReactNode } from "react";
import { Check, Info, Pencil } from "lucide-react";

import { DevSampleFill } from "@/features/devtools/components/dev-sample-fill";
import type { DevSampleInput } from "@/features/devtools/lib/sample-inputs";
import type { MatchNote } from "@/features/tailoring/lib/types";

const titleLabels = ["job title", "title", "role", "position"];
const companyLabels = ["company name", "company", "employer", "organization", "organisation"];

function labeledValue(lines: string[], labels: string[]): string | undefined {
  for (const line of lines) {
    for (const label of labels) {
      const match = new RegExp(`^${label}\\s*[:\\-]\\s*(.+)$`, "i").exec(line);
      const value = match?.[1]?.trim();
      if (value) return value;
    }
  }
  return undefined;
}

function notePoints(text: string): string[] {
  const points = text
    .split(";")
    .map((point) => point.trim().replace(/^[•\-]\s*/, "").replace(/\.$/, ""))
    .filter(Boolean);
  return points.length > 0 ? points : [text];
}

export function readJobTarget(jobDescription: string): { title: string; company: string } {
  const lines = jobDescription
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const title = labeledValue(lines, titleLabels) ?? lines[0] ?? "Job description";
  const company = labeledValue(lines, companyLabels) ?? "Company not listed";
  return { title, company };
}

export function SourceSummaryCard({
  jobDescription,
  skills,
  matchNote,
  editing,
  onToggleEditing,
  isPending,
  onFill,
  children,
}: {
  jobDescription: string;
  skills: string[];
  matchNote?: MatchNote;
  editing: boolean;
  onToggleEditing: () => void;
  isPending: boolean;
  onFill: (sample: DevSampleInput) => void;
  children: ReactNode;
}) {
  const target = readJobTarget(jobDescription);

  return (
    <aside className="min-h-0 overflow-y-auto border-b border-slate-200 bg-slate-50/60 p-6 md:col-span-4 md:h-full md:border-b-0 md:border-r lg:col-span-4 lg:h-full xl:col-span-4">
      <div className="mb-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Target role</p>
        <h2 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-slate-900">{target.title}</h2>
        <p className="mt-0.5 text-sm text-slate-600">{target.company}</p>
        <button
          type="button"
          onClick={onToggleEditing}
          aria-expanded={editing}
          className="mt-3 inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary"
        >
          <Pencil aria-hidden className="size-3.5" />
          {editing ? "Hide source inputs" : "Edit source inputs"}
        </button>
      </div>

      <div className={editing ? "mb-4 space-y-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm" : "hidden"}>
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-slate-600">Plain text works best.</p>
          <DevSampleFill disabled={isPending} onFill={onFill} />
        </div>
        {children}
      </div>

      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Match insights</h2>
        <p className="mt-2 text-sm font-semibold text-slate-900">
          {skills.length} {skills.length === 1 ? "skill" : "skills"} carried into this draft
        </p>
        {skills.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Matching skills">
            {skills.map((skill) => (
              <li key={skill} className="rounded-md border-0 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                {skill}
              </li>
            ))}
          </ul>
        ) : null}
        {matchNote ? (
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            <div>
              <p className="font-semibold text-slate-900">Core strengths</p>
              <ul className="mt-1.5 space-y-1.5">
                {notePoints(matchNote.strengths).map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <Check aria-hidden className="mt-1 size-3.5 shrink-0 text-emerald-600" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Potential gaps</p>
              <ul className="mt-1.5 space-y-1.5">
                {notePoints(matchNote.gaps).map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <Info aria-hidden className="mt-1 size-3.5 shrink-0 text-slate-400" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-[11px] text-slate-500">For you only. This note is not in your PDF.</p>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
