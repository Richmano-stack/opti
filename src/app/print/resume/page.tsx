import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { readPrintJob } from "@/features/tailoring/pdf/print-job";
import { ResumePrintDocument } from "@/features/tailoring/pdf/resume-print-document";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}): Promise<Metadata> {
  const job = readPrintJob(tokenFrom(await searchParams) ?? "");
  return { title: job ? `${job.resume.contact.name} résumé` : "Résumé" };
}

export default async function PrintResumePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const token = tokenFrom(await searchParams);
  const job = token ? readPrintJob(token) : undefined;
  if (!job) notFound();

  return <ResumePrintDocument resume={job.resume} templateId={job.templateId} />;
}

function tokenFrom(searchParams: { token?: string | string[] }): string | undefined {
  return typeof searchParams.token === "string" ? searchParams.token : undefined;
}
