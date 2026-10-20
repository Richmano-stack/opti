import { describe, expect, it } from "vitest";

import { ACCOUNT_HOME, getSafeCallbackUrl } from "./callback-url";

describe("getSafeCallbackUrl", () => {
  it("sends a signed-in user to the tailor studio by default", () => {
    expect(ACCOUNT_HOME).toBe("/dashboard/generator");
    expect(getSafeCallbackUrl(null)).toBe("/dashboard/generator");
    expect(getSafeCallbackUrl("")).toBe("/dashboard/generator");
    expect(getSafeCallbackUrl("https://evil.example")).toBe("/dashboard/generator");
  });

  it("keeps an in-app destination", () => {
    expect(getSafeCallbackUrl("/dashboard")).toBe("/dashboard");
    expect(getSafeCallbackUrl("/dashboard/templates")).toBe("/dashboard/templates");
  });
});
