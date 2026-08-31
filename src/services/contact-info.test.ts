import { describe, expect, it } from "vitest";

import {
  appendContactDetails,
  contactReviewMatches,
  detectMissingContactFields,
  parseContactReview,
} from "./contact-info";

describe("contact information preflight", () => {
  it("detects missing contact information without an AI request", () => {
    expect(detectMissingContactFields(`Jane Doe
jane@example.com
+254 712 345 678
linkedin.com/in/jane-doe
https://janedoe.dev`)).toEqual([]);
  });

  it("does not mistake employment dates for a phone number", () => {
    expect(detectMissingContactFields("Engineer, 2019 - 2024\njane@example.com"))
      .toContain("phone");
  });

  it("parses an explicit review and appends only provided details", () => {
    const formData = new FormData();
    formData.set("contactDecision", "add");
    formData.set("reviewedContactFields", "phone,linkedin");
    formData.set("contact_phone", "+254 712 345 678");
    formData.set("contact_linkedin", "https://linkedin.com/in/jane-doe");
    formData.set("saveContactInfo", "on");

    const review = parseContactReview(formData);
    expect(review).toEqual({
      decision: "add",
      reviewedFields: ["phone", "linkedin"],
      additions: {
        phone: "+254 712 345 678",
        linkedin: "https://linkedin.com/in/jane-doe",
      },
      saveToMasterResume: true,
    });
    expect(appendContactDetails("Jane Doe", review.additions)).toContain(
      "Phone: +254 712 345 678",
    );
  });

  it("requires confirmation for the exact currently missing fields", () => {
    expect(contactReviewMatches(["phone", "linkedin"], ["phone", "linkedin"]))
      .toBe(true);
    expect(contactReviewMatches(["phone", "linkedin"], ["phone"]))
      .toBe(false);
  });
});
