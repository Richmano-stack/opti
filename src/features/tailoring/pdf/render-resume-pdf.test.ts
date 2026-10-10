import { beforeEach, describe, expect, it, vi } from "vitest";

const { launch, close, newPage, goto, pdf, waitForSelector } = vi.hoisted(() => ({
  launch: vi.fn(),
  close: vi.fn(),
  newPage: vi.fn(),
  goto: vi.fn(),
  pdf: vi.fn(),
  waitForSelector: vi.fn(),
}));

vi.mock("playwright", () => ({
  chromium: { launch },
}));

import { readPrintJob } from "@/features/tailoring/pdf/print-job";
import { renderResumePdf } from "@/features/tailoring/pdf/render-resume-pdf";
import type { OptimizedResume } from "@/features/tailoring/lib/types";

const resume: OptimizedResume = {
  contact: {
    name: "Ada Lovelace",
    email: "ada@example.com",
    phone: undefined,
    location: undefined,
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

function tokenFrom(url: string): string {
  const token = new URL(url).searchParams.get("token");
  if (!token) throw new Error("Missing print token");
  return token;
}

describe("renderResumePdf", () => {
  beforeEach(() => {
    launch.mockReset();
    close.mockReset();
    newPage.mockReset();
    goto.mockReset();
    pdf.mockReset();
    waitForSelector.mockReset();
    waitForSelector.mockResolvedValue(undefined);
  });

  it("prints the Letter page and deletes the token", async () => {
    close.mockResolvedValue(undefined);
    pdf.mockResolvedValue(new Uint8Array([0x25, 0x50, 0x44, 0x46]));
    goto.mockImplementation(async (url: string) => {
      expect(readPrintJob(tokenFrom(url))?.templateId).toBe("modern");
      return { ok: () => true, status: () => 200 };
    });
    newPage.mockResolvedValue({ goto, pdf, waitForSelector });
    launch.mockResolvedValue({ newPage, close });

    const bytes = await renderResumePdf({
      resume,
      templateId: "modern",
      origin: "http://127.0.0.1:3000",
    });

    expect(bytes[0]).toBe(0x25);
    expect(goto).toHaveBeenCalledOnce();
    expect(String(goto.mock.calls[0]?.[0])).toContain("http://127.0.0.1:3000/print/resume?token=");
    expect(pdf).toHaveBeenCalledWith({
      format: "Letter",
      printBackground: true,
      preferCSSPageSize: false,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
    expect(waitForSelector).toHaveBeenCalledWith("[data-resume-fitted]");
    expect(close).toHaveBeenCalledOnce();
    expect(readPrintJob(tokenFrom(String(goto.mock.calls[0]?.[0])))).toBeUndefined();
  });

  it("opens the print page once more when the first load is not found", async () => {
    close.mockResolvedValue(undefined);
    pdf.mockResolvedValue(new Uint8Array([0x25, 0x50, 0x44, 0x46]));
    goto
      .mockResolvedValueOnce({ ok: () => false, status: () => 404 })
      .mockImplementationOnce(async (url: string) => {
        expect(readPrintJob(tokenFrom(url))).toBeDefined();
        return { ok: () => true, status: () => 200 };
      });
    newPage.mockResolvedValue({ goto, pdf, waitForSelector });
    launch.mockResolvedValue({ newPage, close });

    await renderResumePdf({ resume, templateId: "minimal", origin: "http://127.0.0.1:3000" });

    expect(goto).toHaveBeenCalledTimes(2);
    expect(readPrintJob(tokenFrom(String(goto.mock.calls[1]?.[0])))).toBeUndefined();
  });

  it("deletes the token when Chromium fails", async () => {
    close.mockResolvedValue(undefined);
    let token = "";
    goto.mockImplementation(async (url: string) => {
      token = tokenFrom(url);
      throw new Error("browser failed");
    });
    newPage.mockResolvedValue({ goto, pdf, waitForSelector });
    launch.mockResolvedValue({ newPage, close });

    await expect(
      renderResumePdf({ resume, templateId: "minimal", origin: "http://127.0.0.1:3000" }),
    ).rejects.toThrow("browser failed");

    expect(close).toHaveBeenCalled();
    expect(readPrintJob(token)).toBeUndefined();
  });
});
