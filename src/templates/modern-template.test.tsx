import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ModernTemplate } from "@/templates/modern-template";
import type { ResumeData } from "@/templates/types";

const resume: ResumeData = {
  contact: {
    name: "Ada Lovelace",
    email: "ada@example.com",
    phone: undefined,
    location: undefined,
  },
  summary: "Wrote the first published algorithm.",
  skills: ["Mathematics"],
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

describe("ModernTemplate", () => {
  it("renders the résumé and skips empty optional sections", () => {
    const html = renderToStaticMarkup(<ModernTemplate resume={resume} />);

    expect(html).toContain("Ada Lovelace");
    expect(html).toContain("1842–Present");
    expect(html).toContain("Mathematics");
    expect(html).not.toContain("Projects");
    expect(html).not.toContain("Education");
    expect(html).not.toContain("Certifications");
  });

  it("renders projects when they exist and omits a blank summary", () => {
    const html = renderToStaticMarkup(
      <ModernTemplate
        resume={{
          ...resume,
          summary: "   ",
          projects: [{ name: "Note G", dates: undefined, bullets: ["Described the analytical engine."] }],
        }}
      />,
    );

    expect(html).toContain("Note G");
    expect(html).not.toContain("Summary");
  });
});
