import { describe, expect, it } from "vitest";

import { readJobTarget } from "./read-job-target";

describe("readJobTarget", () => {
  it("reads a labeled job title and company from the posting", () => {
    expect(readJobTarget("Title: Contact Centre Supervisor\nCompany: MSC Cruises\n")).toEqual({
      title: "Contact Centre Supervisor",
      company: "MSC Cruises",
    });
    expect(readJobTarget("A role with no labels")).toEqual({
      title: "A role with no labels",
      company: "Company not listed",
    });
  });
});
