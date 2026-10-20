import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { listTemplates } from "@/templates/registry";
import { ResumeSheet } from "@/templates/resume-sheet";

describe("ResumeSheet", () => {
  it("sets the sheet font from the template typeface", () => {
    const sans = renderToStaticMarkup(
      <ResumeSheet fitKey="a" typeface="sans">
        <p>Body</p>
      </ResumeSheet>,
    );
    const serif = renderToStaticMarkup(
      <ResumeSheet fitKey="b" typeface="serif">
        <p>Body</p>
      </ResumeSheet>,
    );

    expect(sans).toMatch(/data-typeface="sans"[^>]*class="[^"]*\bfont-sans\b/);
    expect(serif).toMatch(/data-typeface="serif"[^>]*class="[^"]*\bfont-serif\b/);
    expect(serif).not.toContain("font-sans");
  });

  it("keeps every current template on the sans typeface", () => {
    expect(listTemplates().map(({ id, typeface }) => [id, typeface])).toEqual([
      ["modern", "sans"],
      ["minimal", "sans"],
    ]);
  });
});
