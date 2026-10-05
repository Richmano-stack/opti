import { describe, expect, it } from "vitest";

import { prepareContactPreflight } from "./contact-preflight";

const resume = "Jane Doe\njane@example.com";

describe("prepareContactPreflight", () => {
  it("blocks before generation until the missing fields are reviewed", () => {
    expect(prepareContactPreflight(resume, {
      reviewedFields: [], additions: {}, saveToMasterResume: false,
    })).toEqual({
      status: "missing",
      fields: ["phone", "linkedin", "portfolio"],
    });
  });

  it("allows an explicit decision to continue without missing information", () => {
    expect(prepareContactPreflight(resume, {
      decision: "continue",
      reviewedFields: ["phone", "linkedin", "portfolio"],
      additions: {},
      saveToMasterResume: false,
    })).toEqual({ status: "ready", resume, shouldSave: false });
  });

  it("adds complete reviewed information and marks it for an explicit save", () => {
    const result = prepareContactPreflight(resume, {
      decision: "add",
      reviewedFields: ["phone", "linkedin", "portfolio"],
      additions: {
        phone: "+254 712 345 678",
        linkedin: "https://linkedin.com/in/jane-doe",
        portfolio: "https://janedoe.dev",
      },
      saveToMasterResume: true,
    });

    expect(result).toMatchObject({ status: "ready", shouldSave: true });
    expect(result.status === "ready" ? result.resume : "").toContain("CONTACT DETAILS");
  });
});
