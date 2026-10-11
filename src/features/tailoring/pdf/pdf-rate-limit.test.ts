import { describe, expect, it } from "vitest";

import { consumePdfDownload, pdfClientKey, resetPdfRateLimit } from "./pdf-rate-limit";

describe("pdf download rate limit", () => {
  it("allows five downloads in a minute and blocks the sixth", () => {
    resetPdfRateLimit();
    const now = 1_000_000;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect(consumePdfDownload("10.0.0.8", now + attempt).ok).toBe(true);
    }
    const blocked = consumePdfDownload("10.0.0.8", now + 5);
    expect(blocked).toEqual({ ok: false, retryAfterSeconds: 60 });
  });

  it("keeps a separate allowance for each client", () => {
    resetPdfRateLimit();
    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect(consumePdfDownload("10.0.0.1").ok).toBe(true);
    }
    expect(consumePdfDownload("10.0.0.2").ok).toBe(true);
  });

  it("reads the client address from the forwarding headers", () => {
    expect(pdfClientKey(new Headers({ "x-forwarded-for": "203.0.113.4, 10.0.0.1" }))).toBe("203.0.113.4");
    expect(pdfClientKey(new Headers({ "x-real-ip": "203.0.113.9" }))).toBe("203.0.113.9");
    expect(pdfClientKey(new Headers())).toBe("unknown");
  });
});
