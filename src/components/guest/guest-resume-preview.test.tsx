import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { GuestResumePreview } from "./guest-resume-preview";

describe("GuestResumePreview", () => {
  it("renders optional professional links with the other contact details", () => {
    const html = renderToStaticMarkup(
      <GuestResumePreview
        resume={{
          contact: {
            name: "Alex Example",
            email: "alex@example.com",
            phone: undefined,
            location: undefined,
            linkedin: "https://linkedin.com/in/alex-example",
            portfolio: "https://alex.example.com",
          },
          summary: "Frontend engineer.",
          skills: ["TypeScript"],
          experience: [
            {
              company: "Example Co",
              title: "Engineer",
              dates: "2022-Present",
              bullets: ["Built accessible interfaces."],
            },
          ],
          education: [
            { institution: "Example University", degree: "BSc", dates: undefined },
          ],
        }}
      />,
    );

    expect(html).toContain("https://linkedin.com/in/alex-example");
    expect(html).toContain("https://alex.example.com");
    expect(html.indexOf("Experience")).toBeLessThan(html.indexOf("Skills"));
    expect(html).toContain("Engineer");
    expect(html).not.toContain("Certifications");
    expect(html).not.toContain("Projects");
  });

  it("renders certifications and projects when the résumé includes them", () => {
    const html = renderToStaticMarkup(
      <GuestResumePreview
        resume={{
          contact: {
            name: "Alex Example",
            email: undefined,
            phone: undefined,
            location: undefined,
          },
          summary: "Frontend engineer.",
          skills: ["TypeScript"],
          experience: [
            {
              company: "Example Co",
              title: "Engineer",
              dates: "2022-Present",
              bullets: ["Built accessible interfaces."],
            },
          ],
          education: [],
          certifications: [{ name: "AWS Cloud Practitioner", issuer: "Amazon", dates: "2024" }],
          projects: [{ name: "Billing API", dates: "2023", bullets: ["Shipped invoice exports."] }],
          headline: "Customer Operations Leader",
          matchNote: { strengths: "Private strengths.", gaps: "Private gaps." },
        }}
      />,
    );

    expect(html).toContain("Customer Operations Leader");
    expect(html).not.toContain(">Engineer</p>");
    expect(html).not.toContain("Private strengths.");
    expect(html).not.toContain("Private gaps.");
    expect(html).not.toContain("Education");
    expect(html).toContain("AWS Cloud Practitioner");
    expect(html).toContain("Amazon");
    expect(html).toContain("Billing API");
    expect(html.indexOf("Skills")).toBeLessThan(html.indexOf("Certifications"));
    expect(html.indexOf("Certifications")).toBeLessThan(html.indexOf("Projects"));
  });
});
