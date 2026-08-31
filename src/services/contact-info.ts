export const CONTACT_FIELDS = ["email", "phone", "linkedin", "portfolio"] as const;

export type ContactField = (typeof CONTACT_FIELDS)[number];
export type ContactAdditions = Partial<Record<ContactField, string>>;

export type ContactReview = {
  decision?: "add" | "continue";
  reviewedFields: ContactField[];
  additions: ContactAdditions;
  saveToMasterResume: boolean;
};

const detectors: Record<ContactField, (resume: string) => boolean> = {
  email: (resume) => /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(resume),
  phone: (resume) =>
    resume.split(/\r?\n/).some((line) => {
      if (!/(?:\+?\d[\d().\s-]{7,}\d)/.test(line)) return false;
      const digitCount = (line.match(/\d/g) ?? []).length;
      return digitCount >= 10 && digitCount <= 15;
    }),
  linkedin: (resume) => /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/i.test(resume),
  portfolio: (resume) => {
    const urls = resume.match(/(?:https?:\/\/|www\.)[^\s<>()]+/gi) ?? [];
    return urls.some((url) => !/linkedin\.com/i.test(url));
  },
};

export function detectMissingContactFields(resume: string): ContactField[] {
  return CONTACT_FIELDS.filter((field) => !detectors[field](resume));
}

function isContactField(value: string): value is ContactField {
  return CONTACT_FIELDS.includes(value as ContactField);
}

export function parseContactReview(formData: FormData): ContactReview {
  const rawDecision = String(formData.get("contactDecision") ?? "");
  const decision = rawDecision === "add" || rawDecision === "continue"
    ? rawDecision
    : undefined;
  const reviewedFields = String(formData.get("reviewedContactFields") ?? "")
    .split(",")
    .filter(isContactField);
  const additions = Object.fromEntries(
    CONTACT_FIELDS.map((field) => [
      field,
      String(formData.get(`contact_${field}`) ?? "").trim(),
    ]).filter(([, value]) => value),
  ) as ContactAdditions;

  return {
    decision,
    reviewedFields,
    additions,
    saveToMasterResume: formData.get("saveContactInfo") === "on",
  };
}

export function contactReviewMatches(
  missingFields: readonly ContactField[],
  reviewedFields: readonly ContactField[],
): boolean {
  return missingFields.join(",") === reviewedFields.join(",");
}

const labels: Record<ContactField, string> = {
  email: "Email",
  phone: "Phone",
  linkedin: "LinkedIn",
  portfolio: "Portfolio",
};

export function appendContactDetails(
  resume: string,
  additions: ContactAdditions,
): string {
  const lines = CONTACT_FIELDS.flatMap((field) => {
    const value = additions[field]?.trim();
    return value ? [`${labels[field]}: ${value}`] : [];
  });

  if (lines.length === 0) return resume.trim();
  return `${resume.trim()}\n\nCONTACT DETAILS\n${lines.join("\n")}`;
}
