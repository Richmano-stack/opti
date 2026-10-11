import { afterEach, describe, expect, it, vi } from "vitest";

import { downloadOptimizedResumePdf } from "./download-resume-pdf";
import type { OptimizedResume } from "@/features/tailoring/lib/types";

const resume: OptimizedResume = {
  contact: {
    name: "Alex Example",
    email: undefined,
    phone: undefined,
    location: undefined,
  },
  summary: "Frontend engineer.",
  skills: ["TypeScript"],
  experience: [
    {
      company: "Example Company",
      title: "Engineer",
      dates: "2022 - Present",
      bullets: ["Built accessible interfaces."],
    },
  ],
  education: [
    {
      institution: "Example University",
      degree: "BSc",
      dates: undefined,
    },
  ],
};

describe("downloadOptimizedResumePdf", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("downloads the printed PDF with a safe filename and releases the blob URL", async () => {
    const blob = new Blob(["%PDF-test"], { type: "application/pdf" });
    const link = {
      href: "",
      download: "",
      click: vi.fn(),
      remove: vi.fn(),
    };
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      if (input !== "/api/resume-pdf" || init?.method !== "POST") {
        throw new Error("Unexpected download request");
      }
      return new Response(blob, { status: 200 });
    });
    const createObjectURL = vi.fn(() => "blob:opti-pdf");
    const revokeObjectURL = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("document", {
      createElement: vi.fn(() => link),
      body: { appendChild: vi.fn() },
    });
    vi.stubGlobal("URL", { createObjectURL, revokeObjectURL });

    await downloadOptimizedResumePdf(resume, undefined, "modern");

    const call = fetchMock.mock.calls[0];
    expect(call?.[0]).toBe("/api/resume-pdf");
    expect(call?.[1]?.method).toBe("POST");
    expect(JSON.parse(String(call?.[1]?.body))).toEqual({
      resume: {
        ...resume,
        contact: { ...resume.contact, email: null, phone: null, location: null },
        education: [{ ...resume.education[0], dates: null }],
      },
      templateId: "modern",
    });
    expect(link.download).toBe("Alex_Example_Resume.pdf");
    expect(link.click).toHaveBeenCalledOnce();
    expect(link.remove).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:opti-pdf");
  });

  it("tells the user to wait when the download limit is reached", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(null, { status: 429 })));

    await expect(downloadOptimizedResumePdf(resume)).rejects.toThrow(
      "Too many downloads. Please wait a moment and try again.",
    );
  });

  it("throws when the print route rejects the résumé", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(null, { status: 500 })));

    await expect(downloadOptimizedResumePdf(resume)).rejects.toThrow(
      "Your PDF could not be created. Please try again.",
    );
  });
});
