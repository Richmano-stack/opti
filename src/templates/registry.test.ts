import { describe, expect, it } from "vitest";

import { getTemplate, listTemplates } from "@/templates/registry";
import { pageBox, spaceFor } from "@/templates/theme";

describe("template registry", () => {
  it("lists modern and minimal with thumbnail paths", () => {
    const templates = listTemplates();
    expect(templates.map((template) => template.id)).toEqual(["modern", "minimal"]);
    expect(templates[0]).toMatchObject({
      name: "Modern",
      thumbnail: "/templates/modern.svg",
    });
    expect(templates[1]?.description.length).toBeGreaterThan(0);
  });

  it("returns a template by id and rejects an unknown id", () => {
    expect(getTemplate("minimal").name).toBe("Minimal");
    expect(() => getTemplate("executive")).toThrow("Unknown resume template: executive");
  });
});

describe("template theme", () => {
  it("uses the same inch metrics for web pixels and PDF points", () => {
    expect(spaceFor("regular", "px").section).toBe(20);
    expect(spaceFor("regular", "pt").section).toBe(15);
    expect(pageBox("letter", "px").width).toBe(816);
    expect(pageBox("letter", "pt").margin).toBe(43);
    expect(spaceFor("compact", "px").section).toBeLessThan(spaceFor("regular", "px").section);
  });
});
