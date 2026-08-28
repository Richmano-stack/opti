import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

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
  it("renders the idle guest form and privacy message", () => {
    const html = renderToStaticMarkup(<GuestTailoringWorkspace />);

    expect(html).toContain("Master résumé");
    expect(html).toContain("Job description");
    expect(html).toContain("Generate tailored résumé");
    expect(html).toContain("Guest documents are not persisted");
    expect(html).toContain("Your tailored résumé will appear here");
  });

  it("renders validated resume sections for review", () => {
    const html = renderToStaticMarkup(<GuestResumePreview resume={resume} />);

    expect(html).toContain("Taylor Doe");
    expect(html).toContain("Professional summary");
    expect(html).toContain("Product design · Research");
    expect(html).toContain("Designed accessible product experiences.");
  });
});