import { chromium, type Browser, type Page } from "playwright";

import { createPrintJob, deletePrintJob } from "@/features/tailoring/pdf/print-job";
import type { OptimizedResume } from "@/features/tailoring/lib/types";
import type { TemplateId } from "@/templates/registry";

const pdfPage = {
  format: "Letter" as const,
  printBackground: true,
  preferCSSPageSize: false,
  margin: { top: "0", right: "0", bottom: "0", left: "0" },
};

function printUrl(origin: string, token: string): string {
  const url = new URL("/print/resume", origin);
  url.searchParams.set("token", token);
  return url.toString();
}

async function openPrintPage(page: Page, url: string): Promise<"ok" | "missing"> {
  const response = await page.goto(url, { waitUntil: "networkidle" });
  if (response?.status() === 404) return "missing";
  if (!response?.ok()) throw new Error("Print page did not load");
  return "ok";
}

export async function renderResumePdf(input: {
  resume: OptimizedResume;
  templateId: TemplateId;
  origin: string;
}): Promise<Uint8Array> {
  let token = createPrintJob(input.resume, input.templateId);
  let browser: Browser | undefined;

  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 816, height: 1056 } });
    let status = await openPrintPage(page, printUrl(input.origin, token));
    if (status === "missing") {
      deletePrintJob(token);
      token = createPrintJob(input.resume, input.templateId);
      status = await openPrintPage(page, printUrl(input.origin, token));
    }
    if (status !== "ok") throw new Error("Print page did not load");
    await page.waitForSelector("[data-resume-fitted]");
    return await page.pdf(pdfPage);
  } finally {
    await browser?.close();
    deletePrintJob(token);
  }
}
