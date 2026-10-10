import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ResumePrintDocument } from "@/features/tailoring/pdf/resume-print-document";
import type { TemplateId } from "@/templates/registry";
import type { ResumeData } from "@/templates/types";

const resume: ResumeData = {
  contact: {
    name: "Ada Lovelace",
    email: "ada@example.com",
    phone: undefined,
    location: undefined,
  },
  summary: "Wrote the first published algorithm.",
  skills: ["Mathematics", "Analysis"],
  experience: [
    {
      company: "Analytical Engines",
      title: "Programmer",
      dates: "1842–Present",
      bullets: ["Published a method for calculating Bernoulli numbers."],
    },
  ],
  education: [],
};

describe("ResumePrintDocument", () => {
  it("prints Minimal as one Letter sheet with comma-separated skills", () => {
    const html = renderToStaticMarkup(<ResumePrintDocument resume={resume} templateId="minimal" />);

    expect(html).toContain("data-resume-page");
    expect(html).toContain("data-resume-print");
    expect(html).toContain("size: 8.5in 11in");
    expect(html).toContain("[data-resume-print] > article");
    expect(html).toContain("min-width: 0");
    expect(html).toContain("box-shadow: none");
    expect(html).toContain("break-inside: avoid");
    expect(html).toContain("height: auto");
    expect(html).toContain("Ada Lovelace");
    expect(html).toContain("Mathematics, Analysis");
  });

  it("prints Modern from the same registry component, with skills kept apart", () => {
    const html = renderToStaticMarkup(<ResumePrintDocument resume={resume} templateId="modern" />);

    expect(html).toContain("Ada Lovelace");
    expect(html).toContain("@min-[768px]/resume:grid-cols-[minmax(0,1fr)_13rem]");
    expect(html).not.toContain("Mathematics, Analysis");
  });

  it("rejects an unknown template id", () => {
    expect(() =>
      renderToStaticMarkup(
        <ResumePrintDocument resume={resume} templateId={"executive" as TemplateId} />,
      ),
    ).toThrow("Unknown resume template: executive");
  });
});
