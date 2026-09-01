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
  });
});
