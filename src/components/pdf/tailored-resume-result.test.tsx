import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { TailoredResumeResult } from "./tailored-resume-result";

const resume = {
  contact: { name: "Alex Example", email: undefined, phone: undefined, location: undefined },
  summary: "Frontend engineer focused on accessible interfaces.",
  skills: ["TypeScript", "React"],
  experience: [
    {
      company: "Example Company",
      title: "Frontend Engineer",
      dates: "2022 - Present",
      bullets: ["Built accessible interfaces."],
    },
  ],
  education: [{ institution: "Example University", degree: "BSc", dates: undefined }],
};

describe("TailoredResumeResult", () => {
  it("renders the validated resume and PDF download control", () => {
    const html = renderToStaticMarkup(<TailoredResumeResult resume={resume} />);

    expect(html).toContain("Alex Example");
    expect(html).toContain("Download PDF");
    expect(html).toContain("Your PDF is generated in this browser and is not saved by Opti.");
  });
});
