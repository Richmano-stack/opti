import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { createResumePdfDocument, pdf, toBlob } = vi.hoisted(() => ({
  createResumePdfDocument: vi.fn(() => ({ type: "document" })),
  pdf: vi.fn(),
  toBlob: vi.fn(),
}));

vi.mock("@react-pdf/renderer", () => ({ pdf }));
vi.mock("./resume-pdf-document", () => ({ createResumePdfDocument }));

import { downloadOptimizedResumePdf } from "./download-resume-pdf";
import type { OptimizedResume } from "@/services/ai/types";

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
  beforeEach(() => vi.restoreAllMocks());
  afterEach(() => vi.unstubAllGlobals());

  it("downloads with a safe filename and always releases browser resources", async () => {
    const blob = new Blob(["%PDF-test"], { type: "application/pdf" });
    const link = {
      href: "",
      download: "",
      click: vi.fn(),
      remove: vi.fn(),
    };
    const appendChild = vi.fn();
    const createObjectURL = vi.fn(() => "blob:opti-pdf");
    const revokeObjectURL = vi.fn();
    pdf.mockReturnValue({ toBlob });
    toBlob.mockResolvedValue(blob);
    vi.stubGlobal("document", {
      createElement: vi.fn(() => link),
      body: { appendChild },
    });
    vi.stubGlobal("URL", { createObjectURL, revokeObjectURL });

    await downloadOptimizedResumePdf(resume);

    expect(link.download).toBe("Alex_Example_Resume.pdf");
    expect(link.click).toHaveBeenCalledOnce();
    expect(link.remove).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:opti-pdf");
  });
});
