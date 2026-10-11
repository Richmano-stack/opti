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

export function readJobTarget(jobDescription: string): { title: string; company: string } {
  const lines = jobDescription
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const title = labeledValue(lines, titleLabels) ?? lines[0] ?? "Job description";
  const company = labeledValue(lines, companyLabels) ?? "Company not listed";
  return { title, company };
}
