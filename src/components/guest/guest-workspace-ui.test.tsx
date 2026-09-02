import { createRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { OptimizedResume } from "@/services/ai/types";

import { GuestResultPanel } from "./guest-workspace-ui";

const resume: OptimizedResume = {
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
      dates: "2021-Present",
      bullets: ["Designed accessible product experiences."],
    },
  ],
  education: [
    { institution: "Example University", degree: "BFA", dates: undefined },
  ],
};

describe("GuestResultPanel", () => {
  it("shows an explicit generating state", () => {
    const html = renderToStaticMarkup(
      <GuestResultPanel
        state={{ status: "idle" }}
        isPending
        headingRef={createRef<HTMLHeadingElement>()}
      />,
    );

    expect(html).toContain("Tailoring your résumé...");
    expect(html).toContain("This can take a moment.");
    expect(html).toContain('aria-busy="true"');
  });

  it("renders the completed résumé for review", () => {
    const html = renderToStaticMarkup(
      <GuestResultPanel
        state={{ status: "success", data: resume }}
        isPending={false}
        headingRef={createRef<HTMLHeadingElement>()}
      />,
    );

    expect(html).toContain("Taylor Doe");
    expect(html).toContain("Download PDF");
    expect(html).toContain("Ready to review");
    expect(html).toContain("Review every detail before downloading");
  });
});
