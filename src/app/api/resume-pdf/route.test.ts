import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { renderResumePdf } = vi.hoisted(() => ({
  renderResumePdf: vi.fn(),
}));

vi.mock("@/features/tailoring/pdf/render-resume-pdf", () => ({ renderResumePdf }));

import { POST } from "@/app/api/resume-pdf/route";
import { resetPdfRateLimit } from "@/features/tailoring/pdf/pdf-rate-limit";

const resume = {
  contact: {
    name: "Ada Lovelace",
    email: "ada@example.com",
    phone: null,
    location: null,
  },
  summary: "Wrote the first published algorithm.",
  skills: ["Mathematics"],
  experience: [
    {
      company: "Analytical Engines",
      title: "Programmer",
      dates: "1842–Present",
      bullets: ["Published a method for calculating Bernoulli numbers."],
    },
  ],
  education: [],
};

function request(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/resume-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/resume-pdf", () => {
  beforeEach(() => {
    renderResumePdf.mockReset();
    resetPdfRateLimit();
  });

  it("returns the printed PDF", async () => {
    renderResumePdf.mockResolvedValue(new Uint8Array([0x25, 0x50, 0x44, 0x46]));

    const response = await POST(request({ resume, templateId: "modern" }));

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(new Uint8Array(await response.arrayBuffer())[0]).toBe(0x25);
    expect(renderResumePdf).toHaveBeenCalledWith({
      resume: expect.objectContaining({
        contact: expect.objectContaining({ name: "Ada Lovelace", phone: undefined, location: undefined }),
      }),
      templateId: "modern",
      origin: "http://localhost:3000",
    });
  });

  it("defaults a missing template id to Minimal and still prints", async () => {
    renderResumePdf.mockResolvedValue(new Uint8Array([0x25, 0x50, 0x44, 0x46]));

    const response = await POST(request({ resume }));

    expect(response.status).toBe(200);
    expect(renderResumePdf).toHaveBeenCalledWith(expect.objectContaining({ templateId: "minimal" }));
  });

  it("rejects an invalid résumé before launching Chromium", async () => {
    const response = await POST(request({ resume: { contact: { name: "" } }, templateId: "modern" }));

    expect(response.status).toBe(400);
    expect(renderResumePdf).not.toHaveBeenCalled();
  });

  it("rejects an unknown template id before launching Chromium", async () => {
    const response = await POST(request({ resume, templateId: "executive" }));

    expect(response.status).toBe(400);
    expect(renderResumePdf).not.toHaveBeenCalled();
  });

  it("stops launching Chromium after five downloads from the same client", async () => {
    renderResumePdf.mockResolvedValue(new Uint8Array([0x25, 0x50, 0x44, 0x46]));
    const limited = () =>
      new NextRequest("http://localhost:3000/api/resume-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": "203.0.113.8" },
        body: JSON.stringify({ resume, templateId: "minimal" }),
      });

    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect((await POST(limited())).status).toBe(200);
    }
    const blocked = await POST(limited());

    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("Retry-After")).toBeTruthy();
    expect(await blocked.json()).toEqual({
      message: "Too many downloads. Please wait a moment and try again.",
    });
    expect(renderResumePdf).toHaveBeenCalledTimes(5);
  });

  it("returns 500 when printing fails", async () => {
    renderResumePdf.mockRejectedValue(new Error("browser failed"));
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await POST(request({ resume, templateId: "minimal" }));

    expect(response.status).toBe(500);
    expect(error).toHaveBeenCalledWith("[pdf] Failed to print resume Error: browser failed");
    error.mockRestore();
  });
});
