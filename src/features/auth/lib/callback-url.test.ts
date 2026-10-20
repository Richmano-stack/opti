import { describe, expect, it } from "vitest";

import { ACCOUNT_HOME, getSafeCallbackUrl } from "./callback-url";

describe("getSafeCallbackUrl", () => {
  it("sends a signed-in user to the template store by default", () => {
    expect(ACCOUNT_HOME).toBe("/dashboard/templates");
    expect(getSafeCallbackUrl(null)).toBe("/dashboard/templates");
    expect(getSafeCallbackUrl("")).toBe("/dashboard/templates");
    expect(getSafeCallbackUrl("https://evil.example")).toBe("/dashboard/templates");
  });

  it("keeps an in-app destination", () => {
    expect(getSafeCallbackUrl("/dashboard")).toBe("/dashboard");
    expect(getSafeCallbackUrl("/dashboard/generator")).toBe("/dashboard/generator");
  });
});
