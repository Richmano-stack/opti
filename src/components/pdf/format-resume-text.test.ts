import { describe, expect, it } from "vitest";

import type { OptimizedResume } from "@/services/ai/types";
import { formatResumeText } from "./format-resume-text";

describe("formatResumeText", () => {
  it("formats a complete resume into structured plain text", () => {
    const resume: OptimizedResume = {
      contact: {
        name: "Jane Developer",
        email: "jane@example.com",
        phone: "+1 555-0123",
        location: "New York, NY",
        linkedin: "linkedin.com/in/janedev",
        portfolio: "janedev.com",
      },
      summary: "Experienced software engineer specializing in web performance.",
      skills: ["TypeScript", "React", "Next.js", "Node.js"],
      experience: [
        {
          company: "Tech Corp",
          title: "Senior Engineer",
          dates: "2021 – Present",
          bullets: ["Led frontend architecture redesign.", "Improved Core Web Vitals by 40%."],
        },
      ],
      education: [
        {
          institution: "University of Tech",
          degree: "B.S. in Computer Science",
          dates: "2017 – 2021",
        },
      ],
    };

    const text = formatResumeText(resume);

    expect(text).toContain("Jane Developer");
    expect(text).toContain("jane@example.com | +1 555-0123 | New York, NY | linkedin.com/in/janedev | janedev.com");
    expect(text).toContain("PROFESSIONAL SUMMARY");
    expect(text).toContain("Experienced software engineer specializing in web performance.");
    expect(text).toContain("SKILLS");
    expect(text).toContain("TypeScript, React, Next.js, Node.js");
    expect(text).toContain("EXPERIENCE");
    expect(text).toContain("Senior Engineer - Tech Corp (2021 – Present)");
    expect(text).toContain("• Led frontend architecture redesign.");
    expect(text).toContain("• Improved Core Web Vitals by 40%.");
    expect(text).toContain("EDUCATION");
    expect(text).toContain("B.S. in Computer Science - University of Tech (2017 – 2021)");
  });

  it("handles sparse resume safely without throwing or empty sections", () => {
    const resume: OptimizedResume = {
      contact: {
        name: "Minimal User",
        email: undefined,
        phone: undefined,
        location: undefined,
      },
      summary: "Minimal summary",
      skills: ["Coding"],
      experience: [
        {
          company: "Solo",
          title: "Freelancer",
          dates: "2023",
          bullets: ["Built websites."],
        },
      ],
      education: [
        {
          institution: "Self-taught",
          degree: "Cert",
          dates: undefined,
        },
      ],
    };

    const text = formatResumeText(resume);
    expect(text).toContain("Minimal User");
    expect(text).not.toContain("undefined");
    expect(text).toContain("Cert - Self-taught");
  });
});
