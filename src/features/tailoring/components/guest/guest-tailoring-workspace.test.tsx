import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/tailoring/actions/generate-resume", () => ({
  submitGuestResume: vi.fn(),
}));

vi.mock("@/features/tailoring/actions/generate-account-resume", () => ({
  submitAccountResume: vi.fn(),
}));

import { GuestResumePreview } from "./guest-resume-preview";
import { GuestTailoringWorkspace } from "./guest-tailoring-workspace";

const resume = {
  contact: {
    name: "Taylor Doe",
    email: "taylor@example.com",
    phone: undefined,
    location: undefined,
  },
  summary: "Product designer with SaaS experience.",
  skills: ["Product design", "Research"],
  experience: [
    {
      company: "Example Co",
      title: "Product Designer",
      dates: "2021–Present",
      bullets: ["Designed accessible product experiences."],
    },
  ],
  education: [
    { institution: "Example University", degree: "BFA", dates: undefined },
  ],
};

describe("guest tailoring components", () => {
  it("renders the Canva studio workspace and privacy message for guests", () => {
    const html = renderToStaticMarkup(<GuestTailoringWorkspace />);

    expect(html).toContain("Master résumé");
    expect(html).toContain("Job description");
    expect(html).toContain("Tailor my résumé");
    expect(html).toContain("Nothing is saved after this session.");
    expect(html).toContain('aria-label="Opti home"');
    expect(html).toContain('aria-label="Résumé canvas"');
    expect(html).toContain("Your tailored résumé will appear here");
    expect(html).toContain("Strictly 1-page ATS formatted document");
    expect(html).toContain('placeholder="Paste your complete résumé here"');
    expect(html).toContain('placeholder="Paste the complete job posting here"');
    expect(html).not.toContain("Fill sample");
  });

  it("renders validated resume sections for review", () => {
    const html = renderToStaticMarkup(<GuestResumePreview resume={resume} />);

    expect(html).toContain("Taylor Doe");
    expect(html).toContain("Professional summary");
    expect(html).toContain("Product design · Research");
    expect(html).toContain("Designed accessible product experiences.");
  });
});
