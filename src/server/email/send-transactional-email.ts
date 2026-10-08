import { z } from "zod";

const emailEnvSchema = z.object({
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM: z.string().min(3),
});

const resendSuccessSchema = z.object({
  id: z.string().min(1),
});

export type TransactionalEmail = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function authLinkEmail(input: {
  heading: string;
  body: string;
  action: string;
  url?: string;
}): Pick<TransactionalEmail, "text" | "html"> {
  const text = input.url
    ? `${input.heading}\n\n${input.body}\n\n${input.action}: ${input.url}\n\nIf you did not ask for this, you can ignore this email.`
    : `${input.heading}\n\n${input.body}\n\nIf you did not ask for this, you can ignore this email.`;
  const action = input.url
    ? `<p style="margin:24px 0"><a href="${escapeHtml(input.url)}" style="display:inline-block;background:#b42907;color:#ffffff;text-decoration:none;font-weight:700;border-radius:999px;padding:12px 20px">${escapeHtml(input.action)}</a></p><p style="font-size:12px;color:#5a413b;word-break:break-all">${escapeHtml(input.url)}</p>`
    : "";
  const html = `<div style="font-family:Georgia,serif;color:#1a1c1c;line-height:1.5"><h1 style="font-size:20px">${escapeHtml(input.heading)}</h1><p>${escapeHtml(input.body)}</p>${action}<p style="font-size:12px;color:#5a413b">If you did not ask for this, you can ignore this email.</p></div>`;
  return { text, html };
}

export async function sendTransactionalEmail(input: TransactionalEmail): Promise<void> {
  const env = emailEnvSchema.parse({
    RESEND_API_KEY: process.env.RESEND_API_KEY?.trim(),
    RESEND_FROM: process.env.RESEND_FROM?.trim(),
  });

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.RESEND_FROM,
      to: [input.to],
      subject: input.subject,
      text: input.text,
      html: input.html,
    }),
  });

  if (!response.ok) {
    console.error("[email] Resend rejected the message", { status: response.status });
    throw new Error("Email could not be sent.");
  }

  const payload: unknown = await response.json();
  resendSuccessSchema.parse(payload);
}
