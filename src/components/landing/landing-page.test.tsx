import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { LandingPage } from "./landing-page";

describe("LandingPage", () => {
  it("only presents real navigation and truthful product claims", () => {
    const html = renderToStaticMarkup(<LandingPage />);

    expect(html).not.toContain('href="#"');
    expect(html).not.toContain("4.9/5");
    expect(html).not.toContain("Loved by job seekers");
    expect(html).not.toContain("Pricing");
    expect(html).not.toContain("Resources");
    expect(html).toContain("Built around your real experience");
  });
});
