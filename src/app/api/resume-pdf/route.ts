import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { consumePdfDownload, pdfClientKey, PDF_RATE_LIMIT_MESSAGE } from "@/features/tailoring/pdf/pdf-rate-limit";
import { renderResumePdf } from "@/features/tailoring/pdf/render-resume-pdf";
import { optimizedResumeSchema } from "@/features/tailoring/lib/types";
import { templateIds } from "@/templates/registry";

const bodySchema = z.object({
  resume: optimizedResumeSchema,
  templateId: z.enum(templateIds).default("minimal"),
});

export async function POST(request: NextRequest) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid resume" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid resume" }, { status: 400 });
  }

  const limit = consumePdfDownload(pdfClientKey(request.headers));
  if (!limit.ok) {
    return NextResponse.json(
      { message: PDF_RATE_LIMIT_MESSAGE },
      {
        status: 429,
        headers: {
          "Retry-After": String(limit.retryAfterSeconds),
          "Cache-Control": "no-store",
        },
      },
    );
  }

  try {
    const pdf = await renderResumePdf({
      resume: parsed.data.resume,
      templateId: parsed.data.templateId,
      origin: request.nextUrl.origin,
    });
    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Cache-Control": "no-store",
      },
    });
  } catch (error: unknown) {
    const name = error instanceof Error ? error.name : "UnknownError";
    const message = error instanceof Error ? error.message.replace(/token=[^&\s]+/g, "token=redacted") : "Unknown";
    console.error(`[pdf] Failed to print resume ${name}: ${message}`);
    return NextResponse.json(
      { message: "Your PDF could not be created. Please try again." },
      { status: 500 },
    );
  }
}
